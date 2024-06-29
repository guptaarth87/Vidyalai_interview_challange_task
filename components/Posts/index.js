import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import useWindowWidth from '../hooks/useWindowWidth';
import { fetchPosts } from '../../server/posts/posts.service';

// Container for the list of posts
const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

// Styling for the "Load More" button
const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

// Main Posts component
export default function Posts() {
  // State to hold posts and users data
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [start, setStart] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 5;
  
  // Custom hook to get window width
  const { isSmallerDevice } = useWindowWidth();

  // Function to fetch posts data from the API
  const fetchPostsData = async () => {
    setIsLoading(true);

    try {
      // Fetch initial posts
      const { data: initialPosts } = await axios.get('/api/v1/posts', {
        params: { start, limit: isSmallerDevice ? 5 : 10 },
      });

      console.log(initialPosts);
      // Get unique user IDs from the posts
      const userIds = [...new Set(initialPosts.map(post => post.id))];
      
      // Fetch user data for each user ID, handling errors individually
      const userPromises = userIds.map(userId => axios.get(`/api/v1/users/${userId}`).catch(err => ({ error: err, userId })));
      console.log("userPromises", userPromises);

      // Wait for all user data requests to complete
      const usersData = await axios.all(userPromises);
      // Create a map of user data, logging errors if any
      const usersMap = usersData.reduce((acc, userResponse) => {
        if (!userResponse.error) {
          acc[userResponse.data.id] = userResponse.data;
        } else {
          console.error(`Error fetching user ${userResponse.userId}:`, userResponse.error);
        }
        return acc;
      }, {});

      // Update posts and users state
      setPosts(prevPosts => [...prevPosts, ...initialPosts]);
      setUsers(usersMap);
      setIsLoading(false);

      // Clear loading state after 3 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setIsLoading(false);
    }
  };

  // Fetch posts data when the component mounts or when start or isSmallerDevice changes
  useEffect(() => {
    fetchPostsData();
  }, [start, isSmallerDevice]);

  // Handler for the "Load More" button click
  const handleClick = async () => {
    setIsLoading(true);
    const newStart = start + limit;
    
    // Fetch new posts from the server
    const newPosts = await fetchPosts(newStart, limit);
    console.log('New Posts:', newPosts);

    // Update posts state with the new posts
    setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setStart(newStart);
    setIsLoading(false);

    // Clear loading state after 3 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map(post => (
          <Post key={post.id} post={post} user={users[post.userId]} />
        ))}
      </PostListContainer>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LoadMoreButton onClick={handleClick} disabled={isLoading}>
          {!isLoading ? 'Load More' : 'Loading...'}
        </LoadMoreButton>
      </div>
    </Container>
  );
}
