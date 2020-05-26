#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import curses

ekran = curses.initscr()
boyutlar = ekran.getmaxyx()
ekran.addstr(int(boyutlar[0]/2), int(boyutlar[1]/2 - 6), "hello world!",
             curses.A_BOLD)
ekran.refresh()
ekran.getch()
curses.endwin()
