def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_register_and_login(client):
    # Register test user
    reg_payload = {
        "email": "testuser@craveswap.ai",
        "username": "testuser",
        "password": "testpassword123",
        "full_name": "Test User",
        "daily_calorie_target": 2000,
        "dietary_preference": "Balanced"
    }
    response = client.post("/api/v1/auth/register", json=reg_payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["username"] == "testuser"

    # Login test user
    login_payload = {
        "username_or_email": "testuser",
        "password": "testpassword123"
    }
    login_resp = client.post("/api/v1/auth/login", json=login_payload)
    assert login_resp.status_code == 200
    assert "access_token" in login_resp.json()
