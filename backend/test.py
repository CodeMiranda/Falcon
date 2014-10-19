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

def resetjoins():
    db.query("DROP TABLE IF EXISTS joins;")
    db.query("CREATE TABLE joins"
             "(userId BIGINT NOT NULL,"
              "groupId BIGINT NOT NULL,"
              "PRIMARY KEY (groupId, userId)) ENGINE=InnoDB;")

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

def addjoin(userId, groupId):
    cur = db.cursor()
    cur.execute("REPLACE INTO joins (userId, groupId) VALUES (%s, %s)",
                (userId, groupId))

def initdb():
    resetusers()
    resetgroups()
    resetjoins()
    user1 = adduser("zuck", "Mark Zuckerberg", "rage.png")
    user2 = adduser("fu", "Dan Fu", "rage.png")
    user3 = adduser("ho", "Johnny Ho", "rage.png")
    group1 = addgroup(user1, "Gov 20", "Going over reading", "Annenberg", 1413743400, 1413754200)
    group2 = addgroup(user2, "CS 50", "This is a difficult PSet", "Lamont", 1413715000, 1413764340)
    group3 = addgroup(user3, "ES 50", "Talking about lab", "Science Center B", 1413765000, 1413772200)
    addjoin(user1, group1)
    addjoin(user2, group2)
    addjoin(user3, group3)

def queryAll(table, fields):
    db.query("SELECT " + ','.join(fields) + " FROM " + table + ";")
    r = db.use_result()
    rows = r.fetch_row(maxrows=0)
    result = []
    for row in rows:
        result.append(dict(zip(fields, row)))
    return result

def queryMembers(groupId):
    db.query("SELECT userId FROM joins WHERE groupId = %s" % db.literal(groupId))
    r = db.use_result()
    rows = r.fetch_row(maxrows=0)
    return [row[0] for row in rows]

class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")

class MainHandler(BaseHandler):
    def get(self):
        self.write("Hello, world")

class HomeHandler(BaseHandler):
    def get(self):
        result = queryAll('groups', ['id', 'author', 'groupName', 'description', 'location', 'timeStart', 'timeEnd'])
        for row in result:
            row['numMembers'] = len(queryMembers(row['id'])) + 1
        self.write({'success': True, 'reply': result})

class GroupHandler(BaseHandler):
    def get(self):
        id = self.get_argument('id')
        try:
            id = int(id)
        except:
            self.write({'success': False})
            return
        result = queryAll('groups', ['id', 'author', 'groupName', 'description', 'location', 'timeStart', 'timeEnd'])
        members = queryMembers(id)
        for r in result:
            if r['id'] == id:
                if r['author'] not in members:
                    members.append(r['author'])
                r['members'] = members
                self.write({'success': True, 'reply': r})
                return
        self.write({'success': False})

class OwnedHandler(BaseHandler):
    def get(self):
        id = self.get_argument('id')
        try:
            id = int(id)
        except:
            self.write({'success': False})
            return
        result = queryAll('groups', ['id', 'author', 'groupName', 'description', 'location', 'timeStart', 'timeEnd'])
        rows = []
        for r in result:
            if id == r['author']:
                r['numMembers'] = len(queryMembers(r['id'])) + 1
                rows.append(r)
        self.write({'success': True, 'reply': rows})

class JoinedHandler(BaseHandler):
    def get(self):
        id = self.get_argument('id')
        try:
            id = int(id)
        except:
            self.write({'success': False})
            return
        result = queryAll('groups', ['id', 'author', 'groupName', 'description', 'location', 'timeStart', 'timeEnd'])
        rows = []
        for r in result:
            members = queryMembers(r['id'])
            if id in members:
                r['numMembers'] = len(queryMembers(r['id'])) + 1
                rows.append(r)
        self.write({'success': True, 'reply': rows})

class UserHandler(BaseHandler):
    def get(self):
        id = self.get_argument('id')
        try:
            id = int(id)
        except:
            self.write({'success': False})
            return
        result = queryAll('users', ['id', 'handle', 'name', 'picture'])
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

class JoinHandler(BaseHandler):
    def post(self):
        userId = self.get_argument('userId')
        groupId = self.get_argument('groupId')
        try:
            userId = int(userId)
            groupId = int(groupId)
        except:
            self.write({'success': False})
            return
        addjoin(userId, groupId)
        self.write({'success': True})


application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/home", HomeHandler),
    (r"/groups", GroupHandler),
    (r"/owned", OwnedHandler),
    (r"/joined", JoinedHandler),
    (r"/users", UserHandler),
    (r"/add", AddHandler),
    (r"/join", JoinHandler),
    (r"/(favicon.ico)", tornado.web.StaticFileHandler, {"path": "pictures/"}),
    (r"/pictures/(.*)", tornado.web.StaticFileHandler, {"path": "pictures/"}),
])

if __name__ == "__main__":
    initdb()
    application.listen(80)
    tornado.ioloop.IOLoop.instance().start()
