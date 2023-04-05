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
    response = client.post('/', data={'userInput': 'In the Antarctic, after an expedition with Dr. Davis McClaren, the sled dog trainer Jerry Shepherd has to leave the polar base with his colleagues due to the proximity of a heavy snow storm. He ties his dogs to be rescued after, but the mission is called-off and the dogs are left alone at their own fortune. For six months, Jerry tries to find a sponsor for a rescue mission.'})
    assert response.status_code == 200
    json_data = response.get_data(as_text=True)
    print('Response data:', json_data)
    assert b'"title": "Eight Below"' in response.data

# def test_invalid_input(client):
#     response = client.post('/', data={'userInput': ''})
#     assert response.status_code == 400


