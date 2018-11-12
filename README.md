# orbit-engineer
## Generalities
This code aims to provide simplified calculation for orbits in a 2 bodies model with neglectible mass for orbiting object.
It uses Kepler's laws and a few maths about ellipses.
This has been created for the purpose of simplifying calculations for Kerbal Space Program, hence the preset values for reference body are from Kerbol System objects.
It is no complete, check for updates once in a while for more features if you're interested.
Once I'm satisfied with that and if other people are interested, I will put an online version somewhere and share the link for all players to use.
It is licensed under the *WTFPL* so feel free to do whatever you want with that. A reference to this source is still appreciated though.

Add moar boosters and fly safe.

## Program structure
The program uses bower to include the necessary libraries (which is only JQuery for now because I'm lazy).
For now the only feature (orbit calculation) is directly on the index.html.
main.js contains both the functions used to handle the page and the functions used for the calculations
functions.js contains some functions I created to estimate the max distances between a constellation of sats and one object orbiting the same body

I am aware this organization is not even an organization, I will split all of this properly someday.
