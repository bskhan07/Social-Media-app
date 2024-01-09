import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Co2Sharp } from '@mui/icons-material';
import CommentIcon from '@mui/icons-material/Comment';
import { Stack, TextField } from '@mui/material';

import { useFireBase } from '../../Firebase/FireBaseContext';
import { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { useEffect } from 'react';

import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));



export default function RecipeReviewCard({ img, cap, userName, date, postId, likes, userId, userLiked, postOwnerId, numberOfPost, logUser, allComments }) {
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {

    setExpanded(!expanded);
    setPostExpanded((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [showLike, setShowLike] = useState(userLiked)
  const [comment, setComment] = useState("")
  const [postExpanded, setPostExpanded] = useState({});
  const [showComments, setCommnents] = useState()

  const { postLike, addComments, deletePost, loader, setLoader, myPost, setMyPost } = useFireBase()
  const dateObject = new Date(date)

  const navigate = useNavigate()
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const day = dateObject.getDate();
  const monthName = months[dateObject.getMonth()];
  const year = dateObject.getFullYear();

  useEffect(() => {
    setNumberOfLikes(likes);
    setPostExpanded((prev) => ({
      ...prev,
      [postId]: false,
    }));
    setCommnents(allComments)
  }, [likes, userLiked, postId, allComments])


  const likeHandler = () => {
    postLike(postOwnerId, postId, numberOfLikes, userId)
    if (showLike.includes(userId)) {
      setShowLike((prev) => {
        return prev.filter((id) => id !== userId)
      })
      setNumberOfLikes(numberOfLikes - 1)
    }
    else {
      setNumberOfLikes(numberOfLikes + 1)
      setShowLike((prev) => {
        return [...prev, userId]
      })
    }
  }


  const menuButtonHomeNavigateHandler = () => {
    navigate("/home")
  }

  const updatePostHandler = () => {
    navigate("/updatepost", {
      state: {
        imgUrl: img,
        caption: cap,
        postId: postId,
        userId:userId
      }
    })
  }

  const deletePostHandler = () => {
    setLoader(true)
    deletePost(userId, postId)
  }


  const commentHandler = () => {
    setCommnents([...showComments, { user: logUser, comment: comment }])
    addComments(postOwnerId, postId, userId, comment, logUser)
  }


  return (
    loader ? <Loader /> :
      <Card sx={{ width: "500px", }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {userName.slice(0, 1)}
            </Avatar>
          }

          action={
            userId == postOwnerId ?
              <PopupState variant="popover" popupId="demo-popup-menu" >
                {(popupState) => (
                  <>
                    <IconButton aria-label="settings" variant="contained" {...bindTrigger(popupState)} >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu {...bindMenu(popupState)}>
                      <MenuItem onClick={() => { menuButtonHomeNavigateHandler(); popupState.close(); }}>Home</MenuItem>
                      <MenuItem onClick={() => { updatePostHandler(); popupState.close(); }}>Update Post</MenuItem>
                      <MenuItem onClick={() => { deletePostHandler(); popupState.close(); }}>Delete Post</MenuItem>
                    </Menu>
                  </>
                )
                }
              </PopupState>
              : null
          }
          title={userName}
          subheader={`${day} ${monthName}, ${year}`}
        />
        <CardMedia
          component="img"
          onDoubleClick={likeHandler}
          height="400"
          image={img}
          alt="Paella dish"
          sx={{ cursor: "pointer" }}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {cap}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={likeHandler} aria-label="add to favorites">
            <FavoriteIcon sx={{ color: showLike.includes(userId) ? "red" : "gray" }} />
          </IconButton>
          <span>{numberOfLikes}</span>
          <IconButton
            onClick={handleExpandClick}  >
            < CommentIcon />
          </IconButton>
        </CardActions>


        <Collapse in={postExpanded[postId]} timeout="auto" unmountOnExit>
          <CardContent  >

            <Stack direction={"row"} sx={{ alignItems: "flex-end", gap: "15px" }} >
              <TextField onChange={(e) => setComment(e.target.value)} sx={{ width: "90%" }}
                id={`standard-multiline-flexible-${postId}`}
                label="Comments"
                multiline
                maxRows={4}
                variant="standard"
              />
              <SendIcon onClick={commentHandler} sx={{ cursor: "pointer" }} />
            </Stack  >

            {
              showComments?.length == 0 ? <Typography textAlign={"center"} sx={{ marginTop: "20px", color: "gray" }}  > No Commnets </Typography> : showComments?.map((commet, id) => {
                return (
                  <Stack key={id} direction={"row"} sx={{ marginTop: "20px", alignItems: "center" }} >   <Stack direction={"row"} gap={"5px"} sx={{ alignItems: "center", marginRight: "10px" }}  >  <Avatar sx={{ height: "30px", width: "30px" }} >{commet.user.slice(0, 1)}</Avatar> <Typography fontWeight={"bold"} > {commet.user}</Typography> </Stack>  <Typography>  {commet.comment} </Typography> </Stack>
                )
              })
            }
          </CardContent>
        </Collapse>
      </Card>
  );
}