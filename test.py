import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True

    with app.test_client() as client:
        yield client

def test_index_page(client):
    response = client.get('/')
    assert response.status_code == 200

def test_getValue(client):
    response = client.post('/', data={'userInput': 'person can communicate with animals'})
    assert response.status_code == 200
    json_data = response.get_data(as_text=True)
    print('Response data:', json_data)
    assert b'"title": "Dr. Dolittle"' in response.data


