import json
from backend.app import db
from backend.app.models.user import User, UserProfile
from backend.app.models.career import Career, Skill, UserSkill, CareerSkill, CareerRecommendation
from backend.app.models.assessment import AssessmentAttempt

# Section weight mapping for each career category / title
CAREER_ASSESSMENT_WEIGHTS = {
    'Full Stack Developer': {
        'technical': 0.35, 'problem_solving': 0.25, 'logical': 0.20, 'creativity': 0.10, 'communication': 0.10
    },
    'Frontend Developer': {
        'technical': 0.30, 'creativity': 0.30, 'problem_solving': 0.20, 'communication': 0.10, 'logical': 0.10
    },
    'Backend Developer': {
        'technical': 0.35, 'logical': 0.25, 'problem_solving': 0.25, 'communication': 0.10, 'creativity': 0.05
    },
    'Data Analyst': {
        'logical': 0.35, 'technical': 0.25, 'communication': 0.20, 'problem_solving': 0.15, 'creativity': 0.05
    },
    'Data Scientist': {
        'logical': 0.30, 'technical': 0.30, 'problem_solving': 0.25, 'communication': 0.10, 'creativity': 0.05
    },
    'AI/ML Engineer': {
        'technical': 0.35, 'logical': 0.30, 'problem_solving': 0.25, 'creativity': 0.05, 'communication': 0.05
    },
    'Cybersecurity Analyst': {
        'logical': 0.30, 'problem_solving': 0.30, 'technical': 0.25, 'communication': 0.10, 'creativity': 0.05
    },
    'Cloud Engineer': {
        'technical': 0.35, 'problem_solving': 0.25, 'logical': 0.20, 'communication': 0.10, 'creativity': 0.10
    },
    'DevOps Engineer': {
        'technical': 0.35, 'problem_solving': 0.30, 'logical': 0.20, 'communication': 0.10, 'creativity': 0.05
    },
    'UI/UX Designer': {
        'creativity': 0.40, 'communication': 0.25, 'problem_solving': 0.15, 'technical': 0.10, 'logical': 0.10
    },
    'Mobile App Developer': {
        'technical': 0.30, 'creativity': 0.25, 'problem_solving': 0.25, 'logical': 0.10, 'communication': 0.10
    },
    'Software Tester / QA Engineer': {
        'logical': 0.30, 'problem_solving': 0.25, 'technical': 0.25, 'communication': 0.15, 'creativity': 0.05
    }
}

DEFAULT_WEIGHTS = {
    'technical': 0.25, 'logical': 0.25, 'problem_solving': 0.20, 'creativity': 0.15, 'communication': 0.15
}

class CareerRecommendationEngine:
    """
    Rule-based multi-factor recommendation engine.
    Analyzes:
    1. Technical skills match (40% weight)
    2. Assessment aptitude & behavioral scores (35% weight)
    3. User stated interests & career goals keywords (15% weight)
    4. Education & work environment preference fit (10% weight)
    """

    @classmethod
    def generate_recommendations_for_user(cls, user_id):
        user = db.session.get(User, user_id)
        if not user:
            return []

        profile = user.profile
        latest_attempt = AssessmentAttempt.query.filter_by(user_id=user_id).order_by(AssessmentAttempt.completed_at.desc()).first()
        
        # User skills
        user_skills_records = UserSkill.query.filter_by(user_id=user_id).all()
        user_skill_names = set(us.skill.name.lower() for us in user_skills_records if us.skill)
        
        # Section scores from latest assessment if taken
        sec_scores = {}
        if latest_attempt and latest_attempt.section_scores:
            try:
                sec_scores = json.loads(latest_attempt.section_scores)
            except Exception:
                sec_scores = {}

        # Profile interests and goals
        user_interests_str = (profile.interests or '').lower() if profile else ''
        user_goals_str = (profile.career_goals or '').lower() if profile else ''
        user_education_str = (profile.education_level or '').lower() if profile else ''
        user_env_str = (profile.preferred_work_env or '').lower() if profile else ''

        all_careers = Career.query.all()
        scored_careers = []

        for career in all_careers:
            # 1. Skill overlap calculation
            req_skills = [cs.skill.name for cs in career.career_skills if cs.skill and cs.skill_type == 'required']
            pref_skills = [cs.skill.name for cs in career.career_skills if cs.skill and cs.skill_type == 'preferred']
            soft_skills = [cs.skill.name for cs in career.career_skills if cs.skill and cs.skill_type == 'soft']

            all_career_skills = req_skills + pref_skills
            matching_skills = []
            missing_skills = []

            for sk in all_career_skills:
                if sk.lower() in user_skill_names:
                    matching_skills.append(sk)
                else:
                    missing_skills.append(sk)

            # Skill score (out of 100)
            if all_career_skills:
                # Required skills are weighted 70%, preferred 30%
                req_match_count = sum(1 for sk in req_skills if sk.lower() in user_skill_names)
                pref_match_count = sum(1 for sk in pref_skills if sk.lower() in user_skill_names)
                
                req_ratio = (req_match_count / len(req_skills)) if req_skills else 1.0
                pref_ratio = (pref_match_count / len(pref_skills)) if pref_skills else 0.5
                skill_score = (req_ratio * 70.0) + (pref_ratio * 30.0)
            else:
                skill_score = 50.0

            # 2. Assessment score calculation
            weights = CAREER_ASSESSMENT_WEIGHTS.get(career.title, DEFAULT_WEIGHTS)
            if sec_scores:
                weighted_assessment_sum = 0.0
                total_w = 0.0
                for sec, w in weights.items():
                    sec_val = sec_scores.get(sec, 65.0) # baseline 65 if not present
                    weighted_assessment_sum += (sec_val * w)
                    total_w += w
                assessment_score = weighted_assessment_sum / (total_w if total_w > 0 else 1.0)
            else:
                # Neutral baseline if student hasn't taken assessment yet
                assessment_score = 65.0

            # 3. Interests & Goals match
            career_title_keywords = career.title.lower().split()
            career_cat_keywords = career.category.lower().split()
            interest_hits = 0
            for kw in career_title_keywords + career_cat_keywords:
                if kw in user_interests_str or kw in user_goals_str:
                    interest_hits += 1

            if interest_hits >= 2:
                interest_score = 95.0
            elif interest_hits == 1:
                interest_score = 80.0
            elif user_interests_str:
                interest_score = 60.0
            else:
                interest_score = 65.0

            # 4. Education & Difficulty Alignment
            edu_score = 85.0
            if 'bachelor' in user_education_str or 'b.tech' in user_education_str or 'm.tech' in user_education_str:
                edu_score = 95.0
            elif 'diploma' in user_education_str or 'high school' in user_education_str:
                if career.difficulty == 'Beginner':
                    edu_score = 90.0
                elif career.difficulty == 'Intermediate':
                    edu_score = 75.0
                else:
                    edu_score = 65.0

            # Final composite compatibility score (0 - 100)
            composite_score = (
                (skill_score * 0.40) +
                (assessment_score * 0.35) +
                (interest_score * 0.15) +
                (edu_score * 0.10)
            )
            # Bound between 15 and 99.5
            final_score = min(max(composite_score, 18.0), 98.5)

            # Match rationale explanation
            reasons = []
            if matching_skills:
                reasons.append(f"Strong alignment with your existing proficiency in {', '.join(matching_skills[:3])}.")
            else:
                reasons.append(f"Foundational role suited for your learning profile.")

            top_sec = max(weights.items(), key=lambda x: x[1])[0]
            sec_display = top_sec.replace('_', ' ').title()
            reasons.append(f"Your strengths in {sec_display} strongly favor the problem requirements of a {career.title}.")

            if interest_hits > 0:
                reasons.append(f"Matches your stated career focus in {career.category}.")

            match_reason = " ".join(reasons)

            # Actionable steps to improve compatibility
            action_steps = []
            if missing_skills:
                top_missing = missing_skills[:3]
                action_steps.append(f"Study key missing technologies: {', '.join(top_missing)}.")
            action_steps.append(f"Complete the Stage 1 roadmap modules for {career.title}.")
            action_steps.append(f"Build a portfolio project demonstrating {career.title} concepts.")
            if not latest_attempt:
                action_steps.append("Complete the comprehensive skills assessment to refine your compatibility score.")

            scored_careers.append({
                'career': career,
                'score': final_score,
                'match_reason': match_reason,
                'matching_skills': matching_skills,
                'missing_skills': missing_skills,
                'actionable_steps': action_steps
            })

        # Sort descending by score
        scored_careers.sort(key=lambda x: x['score'], reverse=True)

        # Clear existing recommendations for user and save new ones
        CareerRecommendation.query.filter_by(user_id=user_id).delete()

        recommendations = []
        for rank, item in enumerate(scored_careers, start=1):
            rec = CareerRecommendation(
                user_id=user_id,
                career_id=item['career'].id,
                compatibility_score=item['score'],
                rank_order=rank,
                match_reason=item['match_reason'],
                matching_skills=json.dumps(item['matching_skills']),
                missing_skills=json.dumps(item['missing_skills']),
                actionable_steps=json.dumps(item['actionable_steps'])
            )
            db.session.add(rec)
            recommendations.append(rec)

        db.session.commit()
        return recommendations
