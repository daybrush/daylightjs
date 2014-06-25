import re

def readFile(name):
	f = open(name)
	contents = ""
	for line in f:
		contents += line
	f.close()
	return contents
def writeFile(name, contents):
	f = open(name , 'w')
	f.write(contents)
	f.close()

def analyze(file):
	contents = readFile(file);
	c = re.compile(r"//@.+")
	list = c.findall(contents);
	for subfile in list:
		subfile = subfile.replace("//@{", "")
		subfile = subfile.replace("}", "")
		subcontents = analyze(subfile);
		contents = contents.replace("//@{" + subfile + "}", subcontents);

	return contents

contents = analyze("daylight.js")
writeFile("daylight.all.js", contents)