const express = require('express')
const { Artist } = require('../models')
const router = express.Router() 

const db = require('../models')

/* TO-DO's with "*" in the code blocks */

// homepage route
router.get('/', async (req, res) => {
  // * query all docuents from database
  try {
    const allAlbums = await db.Album.find({})
    const allArtists = await db.Artist.find({})

    const context = {
      albums: allAlbums,
      artists: allArtists
    }

    console.log('albums', allAlbums, 'artists', allArtists)

    res.render('collection/index', context)

  } catch (error) {
    console.log(error)
    res.send( { message: 'Internal Server Error'} )
  }
})

// homepage new route 
router.get('/new', (req, res) => {
  res.render('collection/new.ejs')
})

// homepage post route
router.post('/', async (req, res) => {
  try {
    // console.log(req.body)

    const foundArtist = await db.Artist.findOne({ name: req.body.artist })

    if (foundArtist) {

      req.body.artist = foundArtist 
      const createdAlbum = await db.Album.create(req.body)
      foundArtist.albums.push(createdAlbum)
      await foundArtist.save()
  
      res.redirect('/collection')

    } else {

      const createdArtist = await db.Artist.create({ name: req.body.artist })

      req.body.artist = createdArtist 
      const createdAlbum = await db.Album.create(req.body)

      createdArtist.albums.push(createdAlbum)
      await createdArtist.save()
  
      res.redirect('/collection')
    }

  } catch (error) {
    console.log(error)
    res.send({ message: 'Internal Server Error'} )
  }
})

// artist show page
router.get('/artist/:artistID', async (req, res) => {

  try {
    
    const foundArtist = await db.Artist.findById(req.params.artistID)
    console.log(foundArtist)
    const context = {
      artist: foundArtist,
    }

    res.render("collection/artist-show.ejs", context);
} catch (error) {
    console.log(error);
    res.send({message: "Internal Server Error"});
}
})

// album show page
router.get('/album/:albumID', async (req, res) => {
  try {
    const foundAlbum = await db.Album.findById(req.params.albumID)

    const context = {
      album: foundAlbum 
    } 

    res.render('collection/album-show', context)

  } catch (error) {
    console.log(error)
    res.send({ message: 'Internal Service Error'})
  }
})

// album edit page
router.get('/album/:albumID/edit', (req, res) => {
  res.send('This is the album edit page')
})



// artist delete


// album delete


module.exports = router