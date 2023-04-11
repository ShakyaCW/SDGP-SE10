from flask import Flask,render_template, request, jsonify
import json
import numpy as np

app = Flask(__name__)
movieList = []
directorList = {}
castList = {}
genreList = {}

routeCount = 0

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

@app.route("/")
def index_page():
    return render_template('index.html')

@app.route('/contact')
def contact():
    return render_template('feedbackform.html')

@app.route('/use')
def use():
    return render_template('how_to_use.html')

@app.route('/aboutus')
def about():
    return render_template('studentdetails.html')

@app.route('/', methods = ['POST'])
def getValue():
    input = request.form['userInput']
    movieList.clear()
    
    from timeit import default_timer as timer
    import numpy as np
    import pandas as pd
    import torch
    from sentence_transformers import SentenceTransformer
    from scipy.spatial.distance import cdist as scipy_cdist
    import matplotlib.pyplot as plt
    import pickle


    np.random.seed(0)  # for reproducibility


   
    movies = pd.read_csv('./datasets/wiki_movie_plots_deduped_with_summaries.csv', usecols=['Title','Year', 'Origin','Director','Cast','Genre', 'PlotSummary'])
    movies.drop_duplicates(subset='PlotSummary', inplace=True)
    movies.reset_index(drop=True, inplace=True)


    movies.head()


    # In[17]:


    pd.set_option("max_colwidth", 50)

    torch_device = 'cuda' if torch.cuda.is_available() else 'cpu'  # use GPU if available
    encoder = SentenceTransformer('paraphrase-MiniLM-L6-v2', device=torch_device)


    # In[19]:


    pickle_in = open("model.pickle","rb")
    plot_embeddings = pickle.load(pickle_in)


    # In[60]:

    userInput = input

    userInput_embeddings = encoder.encode([userInput], device=torch_device)

    start = timer()

    similarities = 1 - scipy_cdist(userInput_embeddings, plot_embeddings, 'cosine')
    similarities = np.around(similarities, decimals=2)

    end = timer()

    for x in range (-1,-41,-1):
        best_sim_idx = np.argsort(np.max(similarities, axis=0))[x]   # index of the highest cosine similarity
        most_similar_title = movies.loc[best_sim_idx].Title
        intYear = int(movies.loc[best_sim_idx].Year)
        director = str(movies.loc[best_sim_idx].Director)
        cast = str(movies.loc[best_sim_idx].Cast)
        genre = str(movies.loc[best_sim_idx].Genre)
        language = str(movies.loc[best_sim_idx].Origin)
        skip_origins = ["Tamil", "Telugu", "Malayalam", "Kannada", "Bengali"]
        if (intYear <=1985 or language in skip_origins) :
            continue
        movieDict = {}
        movieDict["title"] = most_similar_title
        movieDict["year"] = intYear
        movieDict["director"] = director
        movieDict["cast"] = cast
        movieDict["genre"] = genre

        most_similar_title_sim = np.max(similarities, axis=0)[best_sim_idx] 
        print(f'"{most_similar_title}" - {intYear} - {most_similar_title_sim}')

        movieDict["percentage"] = most_similar_title_sim
        movieList.append(movieDict)


    
    jsonMovies = json.dumps(movieList, indent=2)
    
    # return render_template('page2.html', result=jsonMovies)
    return (jsonMovies)



if __name__ == "__main__":
    app.debug = True
    app.run()
