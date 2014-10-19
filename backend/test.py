import tornado.ioloop
import tornado.web
import MySQLdb

db = MySQLdb.connect(
    host = 'localhost',
    user = 'root',
    passwd = '',
    db = 'testdb',
    port = 3000)

def resetusers():
    db.query("DROP TABLE IF EXISTS users;")
    db.query("CREATE TABLE users"
             "(id BIGINT NOT NULL AUTO_INCREMENT,"
              "handle CHAR(50) NOT NULL,"
              "name CHAR(50) NOT NULL,"
              "picture CHAR(50) NOT NULL,"
              "PRIMARY KEY (id)) ENGINE=InnoDB;")

def resetgroups():
    db.query("DROP TABLE IF EXISTS groups;")
    db.query("CREATE TABLE groups"
             "(id BIGINT NOT NULL AUTO_INCREMENT,"
              "author BIGINT NOT NULL,"
              "groupName CHAR(50) NOT NULL,"
              "description CHAR(50) NOT NULL,"
              "location CHAR(50) NOT NULL,"
              "timeStart BIGINT NOT NULL,"
              "timeEnd BIGINT NOT NULL,"
              "PRIMARY KEY (id)) ENGINE=InnoDB;")

def adduser(handle, name, picture):
    cur = db.cursor()
    cur.execute("INSERT INTO users (handle, name, picture) VALUES (%s, %s, %s)",
                (handle, name, picture))
    return cur.lastrowid

def addgroup(author, groupName, description, location, timeStart, timeEnd):
    cur = db.cursor()
    cur.execute("INSERT INTO groups (author, groupName, description, location, timeStart, timeEnd) VALUES (%s, %s, %s, %s, %s, %s)",
                (author, groupName, description, location, timeStart, timeEnd))
    return cur.lastrowid

def initdb():
    resetusers()
    resetgroups()
    user1 = adduser("zuck", "Mark Zuckerberg", "rage.png")
    group1 = addgroup(user1, "CS 50", "This week's pset is rough", "Thayer", 1413716820, 1413764340)

def queryall(table, fields):
    db.query("SELECT " + ','.join(fields) + " FROM " + table + ";")
    r = db.use_result()
    rows = r.fetch_row(maxrows=0)
    result = []
    for row in rows:
        result.append(dict(zip(fields, row)))
    return result

class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")

class MainHandler(BaseHandler):
    def get(self):
        self.write("Hello, world")

class HomeHandler(BaseHandler):
    def get(self):
        result = queryall('groups', ['id', 'author', 'groupName', 'description', 'location', 'timeStart', 'timeEnd'])
        print result
        self.write({'reply': result})

class GroupHandler(BaseHandler):
    def get(self):
        id = self.get_argument('id')
        try:
            id = int(id)
        except:
            return
        result = queryall('groups', ['id', 'author', 'groupName', 'description', 'location', 'timeStart', 'timeEnd'])
        for r in result:
            if r['id'] == id:
                self.write({'success': True, 'reply': r})
                return
        self.write({'success': False})

class UserHandler(BaseHandler):
    def get(self):
        id = self.get_argument('id')
        try:
            id = int(id)
        except:
            return
        result = queryall('users', ['id', 'handle', 'name', 'picture'])
        for r in result:
            if r['id'] == id:
                self.write({'success': True, 'reply': r})
                return
        self.write({'success': False})

class AddHandler(BaseHandler):
    def post(self):
        groupName = self.get_argument('groupName')
        author = self.get_argument('author')
        description = self.get_argument('description', '')
        location = self.get_argument('location', '')
        timeStart = self.get_argument('timeStart')
        timeEnd = self.get_argument('timeEnd')
        try:
            author = int(author)
            timeStart = int(timeStart)
            timeEnd = int(timeEnd)
        except:
            self.write({'success': False})
            return
        id = addgroup(author, groupName, description, location, timeStart, timeEnd)
        self.write({'success': True, 'id': id})

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/home", HomeHandler),
    (r"/groups", GroupHandler),
    (r"/users", UserHandler),
    (r"/add", AddHandler),
    (r"/(favicon.ico)", tornado.web.StaticFileHandler, {"path": "pictures/"}),
    (r"/pictures/(.*)", tornado.web.StaticFileHandler, {"path": "pictures/"}),
])

if __name__ == "__main__":
    initdb()
    application.listen(8000)
    tornado.ioloop.IOLoop.instance().start()
