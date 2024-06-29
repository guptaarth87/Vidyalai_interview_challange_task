const express = require('express');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');
const axios = require('axios');

const router = express.Router();

/**
 * Fetches images for the given posts.
 * @param {Array} posts - The list of posts to fetch images for.
 * @returns {Array} - The posts with the images included.
 */
async function fetchPostsWithImages(posts) {
  try {
    // Iterate over each post and fetch associated images
    const postsWithImages = await Promise.all(
      posts.map(async (post) => {
        try {
          // Fetch photos for the given post ID
          const response = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);

          // Map the photos to extract the URLs
          const images = response.data.map(photo => ({ url: photo.url }));

          // Return the post with the images added
          return { ...post, images };
        } catch (error) {
          console.error(`Error fetching photos for post ID ${post.id}:`, error);
          return { ...post, images: [] }; // Return the post with an empty images array on error
        }
      })
    );

    return postsWithImages; // Return the posts with images included
  } catch (error) {
    console.error('Error fetching posts with images:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
}

// Route handler for fetching posts with images
router.get('/', async (req, res) => {
  try {
    // Fetch initial posts
    const posts = await fetchPosts();

    // Fetch posts with images
    const postsWithImages = await fetchPostsWithImages(posts);

    // Respond with the posts including images
    res.json(postsWithImages);
  } catch (error) {
    // Handle any errors that occur during the fetch process
    res.status(500).json({ message: 'Error fetching posts with images', error });
  }
});

module.exports = router;
