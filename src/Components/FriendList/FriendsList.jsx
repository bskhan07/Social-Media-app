import React, { useEffect, useState } from 'react'
import { Stack, Typography, Avatar, Button } from '@mui/material'
import { parse } from 'uuid'
import { useFireBase } from '../../Firebase/FireBaseContext'



const FriendsList = ({ logUserId }) => {

    const [friendList, setFriendList] = useState([])

    const { getAllUsers, userData, addFriend, unFollow } = useFireBase()

    const [showAllUsers, setShowUsers] = useState(userData)
    useEffect(() => {
        getAllUsers()

    }, [])
    useEffect(() => {
        const friendsData = JSON.parse(localStorage.getItem('userData'))
        setFriendList(friendsData?.[0]?.friends)

        const notFollowingList = userData?.filter(item1 => !friendList?.some(item2 => item1.id === item2.id))
        setShowUsers(notFollowingList)

    }, [userData])

    const addFriendhandler = (user) => {
        const updateList = showAllUsers.filter((item) => {
            return item.id !== user.id
        })

        setShowUsers(updateList)

        const isExist = friendList.find((item) => {
            return item.id === user.id
        })
        if (!isExist) {
            setFriendList([...friendList, user])
        }
        addFriend(logUserId, user)

    }


    const unfollowHandler = (item) => {
        const isExist = showAllUsers.find((e) => {
            return e.id === item.id
        })

        if (!isExist) {
            setShowUsers([...showAllUsers, item])
            const newList = friendList.filter((e) => {
                return e.id !== item.id
            })
            setFriendList(newList)
        }
        unFollow(item,logUserId)
    }

    return (
        <Stack direction={"column"} >
            <Stack direction={"column"} sx={{
                boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
                width: "300px",
                gap: "15px",
                height: "50vh",
                padding: "20px 10px"
            }}  >

                <Stack direction={"row"} > <Typography variant='h5' > FriendsList </Typography> </Stack>
                {
                    friendList.map((item, index) => {
                        return (
                            <Stack key={index} sx={{
                                justifyContent: 'space-between',
                                alignItems: "center"

                            }} direction={"row"}    >
                                <Stack sx={{ gap: "10px" }} direction={"row"} >
                                    <Avatar sx={{ height: "30px", width: "30px", bgcolor: "#f44336", textTransform: "uppercase" }} >j</Avatar> <Typography fontWeight={"bold"} >{item.userName}</Typography>
                                </Stack>
                                <Button sx={{ color: "black" }} onClick={() => unfollowHandler(item)} variant="text">Unfollow</Button>
                            </Stack>
                        )
                    })
                }
            </Stack>
            <Stack direction={"column"} sx={{
                boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
                width: "300px",
                gap: "15px",
                height: "50vh",
                padding: "20px 10px"
            }}  >

                <Stack direction={"row"} > <Typography variant='h5' > All Users </Typography> </Stack>

                {
                    showAllUsers?.map((user, index) => {
                        return (
                            logUserId == user.id ? null :
                                <Stack key={index} sx={{
                                    justifyContent: 'space-between',
                                    alignItems: "center"

                                }} direction={"row"}    >
                                    <Stack sx={{ gap: "10px" }} direction={"row"} >
                                        <Avatar sx={{ height: "30px", width: "30px", bgcolor: "#f44336", textTransform: "uppercase" }} >{user.userName.slice(0, 1)}</Avatar> <Typography fontWeight={"bold"} > {user.userName}</Typography>
                                    </Stack>
                                    <Button onClick={() => addFriendhandler(user)} sx={{ color: "black" }} variant="text">Follow</Button>
                                </Stack>
                        )
                    })
                }
            </Stack>
        </Stack>
    )
}

export default FriendsList