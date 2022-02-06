# Conway's game of life -- in 3d -- and in your browser

> I'm not a JS pro, so this probably doesn't follow best practices.
> But it does work?!

You can embed this in any page by just dropping in this script tag at the location where you want it to appear.
Right now it will be just 500x500 but that is easily changed in `conway.js`



```js
<script type="module" src="conway.js" type="text/javascript"> </script>
```

Additional features that are half-baked currently include changing the initial state of the game, game size, etc. 
It's the kind of thing that I *had* the intention of doing while writing it but kind of got bored after I got the minimum viable product working.

I know that everyone likes `gif` demos but why not just see it live [here](https://chenbrian.ca/posts/2022/conway.3js)?


```
TODO:

- Add a way to change the initial state of the game
- game grid resizing
- interactive camera control
- better developer api
- optimizing it (abrash's black book, ch 17, 18) http://www.jagregory.com/abrash-black-book/#chapter-17-the-game-of-life
```



