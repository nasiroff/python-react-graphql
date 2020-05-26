import tkinter as tk
from tkinter import filedialog

from newClass import newClass

window = tk.Tk()

window.title("pencere")
window.geometry('1000x500')


def openFile():
    window.filename = filedialog.askopenfilename(initialdir='C:/', title='Select File', filetypes = (("jpeg files","*.jpg"),("all files","*.*")))
    newClass(window)

button = tk.Button(window, command=openFile, text="salamu elekum")
button.pack()

window.mainloop()
