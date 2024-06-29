import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import styled from '@emotion/styled';

// Container for the entire post
const PostContainer = styled.div(() => ({
  width: '300px',
  margin: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  overflow: 'hidden',
}));

// Container for the image carousel
const CarouselContainer = styled.div(() => ({
  position: 'relative',
}));

// Styles for the carousel, hiding the scrollbar
const Carousel = styled.div(() => ({
  display: 'flex',
  overflowX: 'scroll',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  position: 'relative',
}));

// Individual carousel item styling
const CarouselItem = styled.div(() => ({
  flex: '0 0 auto',
  scrollSnapAlign: 'start',
}));

// Image styling within the carousel
const Image = styled.img(() => ({
  width: '280px',
  height: 'auto',
  maxHeight: '300px',
  padding: '10px',
}));

// Content area styling
const Content = styled.div(() => ({
  padding: '10px',
  '& > h2': {
    marginBottom: '16px',
  },
}));

// Button styling for the carousel navigation
const Button = styled.button(() => ({
  position: 'absolute',
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  border: 'none',
  color: '#000',
  fontSize: '20px',
  cursor: 'pointer',
  height: '50px',
}));

// Positioning the previous button
const PrevButton = styled(Button)`
  left: 12px;
  top:40%;
`;

// Positioning the next button
const NextButton = styled(Button)`
  right: 12px;
  top:40%;
`;

// Styling for the content box containing user info
const ContentBox0 = styled.div(() => ({
  padding: '5px',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '5px',
}));

const ContentBox1 = styled.div(() => ({
  lineHeight: '1',
}));

// Post component to display individual post and user info
const Post = ({ post, user }) => {
  const carouselRef = useRef(null);

  // Handler for the next button click, scrolls the carousel to the right
  const handleNextClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  };

  // Handler for the previous button click, scrolls the carousel to the left
  const handlePrevClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  // Return an empty div if user or post images are not available
  if (!user || !post.images) {
    return <div></div>;
  }

  // Helper function to get the initial of the user's last name
  const splitting = () => {
    const names = user.name.split(' ');
    return names[1].charAt(0);
  };

  // Helper function to get the initials of the user's full name
  const splitName = (name) => {
    const curr = name.split(" ");
    return `${curr[0].charAt(0)} ${curr[1].charAt(0)}`;
  };

  return (
    <PostContainer>
      <ContentBox0>
        <h4 style={{ fontSize: '22px', backgroundColor: 'RGB(128, 128, 128)', color: 'white', textAlign: 'center', padding: '10px', borderRadius: '50%' }}>
          {user.name.charAt(0)}{splitting()}
        </h4>
        <ContentBox1>
          <h3>{splitName(user.name)}</h3>
          <h5>{user.email}</h5>
        </ContentBox1>
      </ContentBox0>
      <CarouselContainer>
        <Carousel ref={carouselRef}>
          {post.images.map((image, index) => (
            <CarouselItem key={index}>
              <Image src={image.url} alt={post.title} />
            </CarouselItem>
          ))}
        </Carousel>
        <PrevButton onClick={handlePrevClick}>&#10094;</PrevButton>
        <NextButton onClick={handleNextClick}>&#10095;</NextButton>
      </CarouselContainer>
      <Content>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </Content>
    </PostContainer>
  );
};

// Prop types validation for the Post component
Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      })
    ).isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
};

export default Post;
