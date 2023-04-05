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

@app.route('/', methods = ['POST'])
def getValue():
    input = request.form['userInput']
    movieList.clear()
    
        #!/usr/bin/env python
    # coding: utf-8

    # In[15]:


    from timeit import default_timer as timer
    import numpy as np
    import pandas as pd
    import faiss
    import torch
    from sentence_transformers import SentenceTransformer
    from scipy.spatial.distance import cdist as scipy_cdist
    import matplotlib.pyplot as plt
    import pickle


    np.random.seed(0)  # for reproducibility


    # In[57]:


    # wikipedia movie plots with summarization dataset (max 128 tokens): https://www.kaggle.com/gabrieltardochi/wikipedia-movie-plots-with-plot-summaries
    # original wikipedia movie plots dataset (no summarization): https://www.kaggle.com/jrobischon/wikipedia-movie-plots
    movies = pd.read_csv('C:/Users/ASUS/Desktop/SDGP-SE10/datasets/wiki_movie_plots_deduped_with_summaries.csv', usecols=['Title','Year', 'Origin','Director','Cast','Genre', 'PlotSummary'])
    movies.drop_duplicates(subset='PlotSummary', inplace=True)
    movies.reset_index(drop=True, inplace=True)

    # print(f"Plots of {len(movies.index)} movies!")

    movies.head()


    # In[17]:


    pd.set_option("max_colwidth", 50)

    torch_device = 'cuda' if torch.cuda.is_available() else 'cpu'  # use GPU if available
    encoder = SentenceTransformer('paraphrase-MiniLM-L6-v2', device=torch_device)


    # In[19]:


    pickle_in = open("model.pickle","rb")
    plot_embeddings = pickle.load(pickle_in)


    # In[60]:


    # getting the most similar movie for Godzilla vs. Kong (2021 movie, not in the Dataset)
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

        movieList.append(movieDict)

        most_similar_title_sim = np.max(similarities, axis=0)[best_sim_idx] 
        print(f'"{most_similar_title}" - {intYear} - {most_similar_title_sim}')
    
    # for movieCount in range(21):
    #     intYear = int((df2.iloc[movieCount]["Year"]))
    #     movieList[(df2.iloc[movieCount]["Title"])] = intYear

    # write the movies list to a JSON file
    # with open('movies.json', 'w') as f:
    #     json.dump(movieList, f, cls=NpEncoder)


    
    jsonMovies = json.dumps(movieList, indent=2)
    return render_template('page2.html', result=jsonMovies)

    

    
    
    # return jsonify(movieList)
    # return render_template('page2.html')
    
    




    # result = (df2.iloc[0]["Title"])
    # return render_template('page2.html', result=jsonMovies)
    # print (df2.iloc[1]["Title"])
    # print (df2.iloc[2]["Title"])
    # print (df2.iloc[3]["Title"])
    # print (df2.iloc[4]["Title"])
    # print (df2.iloc[5]["Title"])
    # print (df2.iloc[6]["Title"])
    # print (df2.iloc[7]["Title"])
    # print (df2.iloc[8]["Title"])
    # print (df2.iloc[9]["Title"])
    # print (df2.iloc[10]["Title"])

    # print (df2.iloc[11]["Title"])
    # print (df2.iloc[12]["Title"])
    # print (df2.iloc[13]["Title"])
    # print (df2.iloc[14]["Title"])
    # print (df2.iloc[15]["Title"])
    # print (df2.iloc[16]["Title"])
    # print (df2.iloc[17]["Title"])
    # print (df2.iloc[18]["Title"])
    # print (df2.iloc[19]["Title"])
    # print (df2.iloc[20]["Title"])
    # print (df2.iloc[21]["Title"])
    # print(forC)


    # data


# In[ ]:
    
    # return render_template('page2.html', inp=result)

# @app.route('/data')
# def getData():
#     return jsonify(movieList)

# @app.route("/")
# def page2():
#     return render_template('page2.html')

# @app.route('/', methods = ['POST'])
# def loadPage():
#     return render_template('page2.html')

if __name__ == "__main__":
    app.debug = True
    app.run()


    



