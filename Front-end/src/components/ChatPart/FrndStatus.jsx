import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faVideoCamera,
    faPhone,
    faUserPlus,
    faClock,
    faCheck
} from "@fortawesome/free-solid-svg-icons";
import { useChatStore } from "../../store/useChatStore.js";
import { authStore } from "../../store/authStore.js";

function FrndStatus() {
    const [friendData, setFriendData] = useState({
        name: "",
        id: "",
        status: "not", // default status
        created_by: ""
    });
    const { selectedUser, MyFrndStat, getFriendStatus } = useChatStore();
    const { authUser, acceptfriend, addfriend } = authStore();

    useEffect(() => {
        if (MyFrndStat?.friendship && MyFrndStat?.u_data) {
            const friend_status = MyFrndStat.friendship.status;
            const friend_id = MyFrndStat.u_data._id;
            const friend_name = `${MyFrndStat.u_data.first_name} ${MyFrndStat.u_data.last_name}`;
            const created_by = MyFrndStat.friendship.createdBy;

            setFriendData({
                name: friend_name,
                id: friend_id,
                status: friend_status,
                created_by: created_by
            });
        } else if (selectedUser) {
            // Friendship doesn't exist yet
            setFriendData({
                name: `${selectedUser.first_name} ${selectedUser.last_name}`,
                id: selectedUser._id,
                status: "not",
                created_by: ""
            });
        }
        // console.log(MyFrndStat)
    }, [MyFrndStat, selectedUser]);
    getFriendStatus(selectedUser._id);
        // console.log(MyFrndStat)
    const add_friend = async (id) => {
        try {
            await addfriend(id);
            getFriendStatus(id);
        } catch (error) {
            console.error("Error adding friend:", error.message);
        }
    };

    const accept_friend = async (id) => {
        try {
            await acceptfriend(id);
            getFriendStatus(id);
        } catch (error) {
            console.error("Error accepting friend:", error.message);
        }
    };
    const renderFriendActions = () => {
        const { status, created_by, id } = friendData;

        if (status === "accepted") {
            return (
                <>
                    <div className="opt rounded-r-lg">
                        <FontAwesomeIcon icon={faVideoCamera} onClick={() => setModal("video")} title="Video Call" />
                    </div>
                    <div className="opt rounded-l-lg">
                        <FontAwesomeIcon icon={faPhone} onClick={() => setModal("audio")} title="Voice Call" />
                    </div>
                </>
            );
        }

        if (status === "pending") {
            if (created_by === authUser._id) {
                // You sent the request
                return (
                    <div className="opt rounded-lg">
                        <FontAwesomeIcon icon={faClock} title="Friend Request Sent (Pending)" />
                    </div>
                );
            } else {
                // They sent the request
                return (
                    <div className="opt rounded-lg">
                        <FontAwesomeIcon
                            icon={faCheck}
                            title="Accept Friend Request"
                            onClick={() => accept_friend(id)}
                        />
                    </div>
                );
            }
        }

        if (status === "not") {
            return (
                <div className="opt rounded-lg">
                    <FontAwesomeIcon
                        icon={faUserPlus}
                        title="Send Friend Request"
                        onClick={() => add_friend(id)}
                    />
                </div>
            );
        }

        return null;
    };
    return (<>{renderFriendActions()}</>
    )
}

export default FrndStatus
