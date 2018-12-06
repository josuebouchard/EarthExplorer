import sys, json
from PIL import Image

img = Image.open("data.png")
pixels = img.load()
data = json.loads(open("data.json", "r").read())

def getInput():
    line = sys.stdin.readline()
    return json.loads(line)

def main():
    line = getInput()
    colorCode = pixels[line["x"], line["y"]]
    if(colorCode[3] == 255):
        index = colorCode[0] + colorCode[1] + colorCode[2]
        print(json.dumps(data[index]))
    else:
        print("Water")

if __name__ == "__main__":
    main()