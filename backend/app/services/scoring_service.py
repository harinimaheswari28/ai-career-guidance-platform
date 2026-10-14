import json
from backend.app import db
from backend.app.models.assessment import (
    AssessmentQuestion, AssessmentOption, AssessmentAttempt, AssessmentAnswer
)
from backend.app.models.activity import Notification
from backend.app.services.recommendation_engine import CareerRecommendationEngine

class AssessmentScoringService:
    @classmethod
    def evaluate_submission(cls, user_id, answers_dict):
        """
        answers_dict: dict of {str(question_id): option_id} or list of {question_id, option_id}
        """
        if isinstance(answers_dict, list):
            mapped_answers = {str(item.get('question_id')): item.get('option_id') for item in answers_dict}
        else:
            mapped_answers = {str(k): v for k, v in answers_dict.items()}

        all_questions = AssessmentQuestion.query.all()
        if not all_questions:
            return None

        section_totals = {}
        section_weights = {}

        attempt_answers = []

        for q in all_questions:
            sec = q.section
            if sec not in section_totals:
                section_totals[sec] = 0.0
                section_weights[sec] = 0.0

            # Default maximum possible score weight for a question is 1.0 (or max option weight)
            max_opt_weight = max([opt.score_weight for opt in q.options], default=1.0)
            section_weights[sec] += max_opt_weight

            chosen_opt_id = mapped_answers.get(str(q.id))
            if chosen_opt_id:
                chosen_opt = db.session.get(AssessmentOption, chosen_opt_id)
                if chosen_opt and chosen_opt.question_id == q.id:
                    section_totals[sec] += chosen_opt.score_weight
                    attempt_answers.append((q.id, chosen_opt.id))

        # Calculate section percentages
        section_scores = {}
        total_possible = 0.0
        total_earned = 0.0

        for sec, max_weight in section_weights.items():
            earned = section_totals.get(sec, 0.0)
            percentage = (earned / max_weight * 100.0) if max_weight > 0 else 70.0
            section_scores[sec] = round(percentage, 1)
            total_possible += max_weight
            total_earned += earned

        overall_score = round((total_earned / total_possible * 100.0) if total_possible > 0 else 70.0, 1)

        # Identify strengths and areas for improvement
        strengths = []
        improvement_areas = []

        section_display_names = {
            'technical': 'Technical & Engineering Foundation',
            'logical': 'Logical & Algorithmic Reasoning',
            'communication': 'Communication & Team Collaboration',
            'problem_solving': 'Complex Problem Solving',
            'creativity': 'Design & Creative Ideation',
            'work_preferences': 'Autonomous Execution & Delivery',
            'work_env': 'Modern Engineering Agile Environment',
            'education_exp': 'Academic & Project Preparedness'
        }

        for sec, score in section_scores.items():
            name = section_display_names.get(sec, sec.replace('_', ' ').title())
            if score >= 75.0:
                strengths.append(f"{name} ({score}%) - Demonstrates advanced aptitude and natural affinity.")
            else:
                improvement_areas.append(f"{name} ({score}%) - Growth potential through guided hands-on practice.")

        if not strengths:
            strengths.append("Foundational Computer Science general aptitude and eagerness to learn.")

        suggested_next_steps = [
            "Review your ranked career recommendations to see role compatibility.",
            "Choose a target career path and follow its structured step-by-step learning roadmap.",
            "Work on hands-on coding exercises and build real-world portfolio mini-projects."
        ]

        attempt = AssessmentAttempt(
            user_id=user_id,
            total_score=overall_score,
            section_scores=json.dumps(section_scores),
            strengths=json.dumps(strengths),
            improvement_areas=json.dumps(improvement_areas),
            suggested_next_steps=json.dumps(suggested_next_steps)
        )
        db.session.add(attempt)
        db.session.flush()

        for q_id, opt_id in attempt_answers:
            ans = AssessmentAnswer(
                attempt_id=attempt.id,
                question_id=q_id,
                option_id=opt_id
            )
            db.session.add(ans)

        # Create notification
        notif = Notification(
            user_id=user_id,
            title="Assessment Completed",
            message=f"You completed your skills assessment with an overall score of {overall_score}%. Personalized career recommendations have been updated!",
            type="success"
        )
        db.session.add(notif)
        db.session.commit()

        # Recalculate recommendations
        CareerRecommendationEngine.generate_recommendations_for_user(user_id)

        return attempt
