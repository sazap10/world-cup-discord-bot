# World Cup Discord Bot

A discord bot for displaying information about the FIFA World Cup 2018.  This uses the [Soccer for good API](http://worldcup.sfg.io/) to retrieve the data.

## How to use


## Available commands

Prefix each command with "!world-cup"

1. today
2. tomorrow
3. current
4. groups

### today
This displays today's schedule of matches with optionally showing the current/finished score.

```
Matches today:
12:00: Sweden vs Korea Republic @ Nizhny Novgorod Stadium, Nizhny Novgorod, currently playing: HT 0 - 0
15:00: Belgium vs Panama @ Fisht Stadium, Sochi
18:00: Tunisia vs England @ Volgograd Arena, Volgogra
```

### tomorrow
This displays tomorrow's schedule of matches.

```
Matches tomorrow:
12:00: Colombia vs Japan @ Mordovia Arena, Saransk
15:00: Poland vs Senegal @ Spartak Stadium, Moscow
18:00: Russia vs Egypt @ Saint Petersburg Stadium, St. Petersburg
```

### current
This displays the status of the current matches with the current time and score.

```
HT Sweden 0 - 0 Korea Republic
```

### groups
This displays the current standings of the groups.

```
.-----------------------------------------.
|                 Group A                 |
|-----------------------------------------|
|     Team     | Points | Goal Difference |
|--------------|--------|-----------------|
| Russia       |      3 |               5 |
| Uruguay      |      3 |               1 |
| Egypt        |      0 |              -1 |
| Saudi Arabia |      0 |              -5 |
'-----------------------------------------'
.-------------------------------------.
|               Group B               |
|-------------------------------------|
|   Team   | Points | Goal Difference |
|----------|--------|-----------------|
| Iran     |      3 |               1 |
| Spain    |      1 |               0 |
| Portugal |      1 |               0 |
| Morocco  |      0 |              -1 |
'-------------------------------------'
.--------------------------------------.
|               Group C                |
|--------------------------------------|
|   Team    | Points | Goal Difference |
|-----------|--------|-----------------|
| France    |      3 |               1 |
| Denmark   |      3 |               1 |
| Australia |      0 |              -1 |
| Peru      |      0 |              -1 |
'--------------------------------------'
.--------------------------------------.
|               Group D                |
|--------------------------------------|
|   Team    | Points | Goal Difference |
|-----------|--------|-----------------|
| Croatia   |      3 |               2 |
| Iceland   |      1 |               0 |
| Argentina |      1 |               0 |
| Nigeria   |      0 |              -2 |
'--------------------------------------'
.----------------------------------------.
|                Group E                 |
|----------------------------------------|
|    Team     | Points | Goal Difference |
|-------------|--------|-----------------|
| Serbia      |      3 |               1 |
| Switzerland |      1 |               0 |
| Brazil      |      1 |               0 |
| Costa Rica  |      0 |              -1 |
'----------------------------------------'
.-------------------------------------------.
|                  Group F                  |
|-------------------------------------------|
|      Team      | Points | Goal Difference |
|----------------|--------|-----------------|
| Mexico         |      3 |               1 |
| Korea Republic |      0 |               0 |
| Sweden         |      0 |               0 |
| Germany        |      0 |              -1 |
'-------------------------------------------'
.------------------------------------.
|              Group G               |
|------------------------------------|
|  Team   | Points | Goal Difference |
|---------|--------|-----------------|
| Belgium |      0 |               0 |
| England |      0 |               0 |
| Tunisia |      0 |               0 |
| Panama  |      0 |               0 |
'------------------------------------'
.-------------------------------------.
|               Group H               |
|-------------------------------------|
|   Team   | Points | Goal Difference |
|----------|--------|-----------------|
| Senegal  |      0 |               0 |
| Colombia |      0 |               0 |
| Japan    |      0 |               0 |
| Poland   |      0 |               0 |
'-------------------------------------'

```

## Run your own bot
