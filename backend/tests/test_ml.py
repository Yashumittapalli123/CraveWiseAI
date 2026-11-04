from app.services.ml_predictor import predictor

def test_ml_risk_window_prediction():
    predictions = predictor.predict_high_risk_windows([])
    assert "high_risk_hours" in predictions
    assert "smart_reminders" in predictions
    assert len(predictions["smart_reminders"]) >= 1
