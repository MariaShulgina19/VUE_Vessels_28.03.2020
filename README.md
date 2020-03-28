# Harbour today

## What is about:

```
Main idea is to  do visualistation of the vessels position in the particular harbour area.
Programm pick up date from four different API calls.
It has been made vith Vue Cli.
```

### First part:
```
Fist table shows vessels that have been called to a particular port at a particular date,
it includes vessel in the port, 
vessels that are arriving and vessels that already left from the harbour. 
This port call does not provide information about coordinates 
and does not include every vessels identification numbers. 
Even it was trying to get coordinates by id, 
but because there is not all id provided, it was not possible.
```

### Second part:
```
The second table is showing all vessels in 50 km distance, including pilots. 
This part includes  API calls: to find vessels name and identification numbers 
and second API call provides coordinate for only this particular vessel.
So, in that case, do not need to load data about hole vessels in the world.

```

### Third part:
```
Visualisation of vessels position on the map.
The map is showing only port area and vessels in 50 km distance.
When mouse in on the marker with vessel, 
popup windows shows additional information about 
vessel: name, identification number/mmsi and coordinates.

```
## Development ideas
### Do it lighter and code more readable:
### Add more data:
### Improve design:



### Link
See [How does it works](https://dos.seamk.fi/~epedu+k1601808/dist/).
