from flask import Flask, render_template

app = Flask(__name__)

# This will be the home page
@app.route('/')
def homePage():
    return render_template("index.html")


@app.route('/statistics')
def statisticsPage():
    return render_template("statistics.html")

@app.route('/dynamic')
def dynamicPage():
    return render_template("dynamic.html")

if __name__ == '__main__':
    app.run(debug=True)
