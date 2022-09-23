import { Button } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { femaleAvatar, maleAvatar } from "../../images";
import { useAppSelector } from "../../redux/hooks";
import { selectProfile } from "../doc-profile";
import PageWrap from "../page-wrap";
import "./styles.scss";

const EuaHome = () => {
    const selectedUserProfile = useAppSelector(selectProfile);
    const isMale = selectedUserProfile.gender === "M";
    const navigate = useNavigate();

    return (
        <PageWrap label="Home" withBack={false}>
            <div className="home-page">
                <div className="user-card">
                    {/* {!selectedUserProfile.profilePhoto ? (
                        <img
                            src={`data:image/png;base64, ${selectedUserProfile.profilePhoto}`}
                            alt="User"
                        />
                    ) : ( */}
                    <img src={isMale ? maleAvatar : femaleAvatar} alt="User" />
                    {/* // )} */}
                    <div className="card-right">
                        <span className="primary">
                            {isMale ? "Mr. " : "Ms/Mrs. "}
                            <span>
                                {selectedUserProfile.name?.first +
                                    " " +
                                    selectedUserProfile.name?.middle +
                                    " " +
                                    selectedUserProfile.name?.last}
                            </span>
                        </span>
                        <span className="secondary">
                            DOB:{" "}
                            <b>{`${selectedUserProfile.dateOfBirth?.date}/${selectedUserProfile.dateOfBirth?.month}/${selectedUserProfile.dateOfBirth?.year}`}</b>
                        </span>
                        <span className="secondary">
                            Gender: <b>{isMale ? "Male" : "Female"}</b>
                        </span>
                        <span className="secondary">
                            ABHA Address: <b>{selectedUserProfile.id}</b>
                        </span>
                    </div>
                </div>
                <div className="btn-array">
                    <Button
                        onClick={() => {
                            navigate("/eua/my-appointments");
                        }}
                    >
                        {"My Appointments"}
                    </Button>
                    <Button
                        onClick={() => {
                            navigate("/eua/search");
                        }}
                    >
                        {"Search Doctor"}
                    </Button>
                </div>
            </div>
        </PageWrap>
    );
};

export default EuaHome;
