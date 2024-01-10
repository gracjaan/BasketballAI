from flask import Flask, render_template

app = Flask(__name__)

# This will be the home page
@app.route('/')
def homePage():
    return render_template("index.html")


@app.route('/statistics')
def statisticsPage():
    return

@app.route('/dynamic')
def dynamicPage():
    return

if __name__ == '__main__':
    app.run(debug=True)
