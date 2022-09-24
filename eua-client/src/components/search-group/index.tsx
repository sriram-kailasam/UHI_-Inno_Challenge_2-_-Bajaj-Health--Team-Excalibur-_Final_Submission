import { useNavigate } from "react-router-dom";
import PageWrap from "../page-wrap";
import GroupSearch from "../search-listing/group-search";

const DoctorSearchGroup = () => {
    const navigate = useNavigate();
    return (
        <PageWrap
            label="Book a Group Consultation"
            withBack
            onBack={() => {
                navigate(-1);
            }}
        >
            <GroupSearch />
        </PageWrap>
    );
};

export default DoctorSearchGroup;
