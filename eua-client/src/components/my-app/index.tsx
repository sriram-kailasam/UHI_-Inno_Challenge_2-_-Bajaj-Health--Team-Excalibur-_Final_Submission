import { useNavigate } from "react-router-dom";
import PageWrap from "../page-wrap";
import SearchListing from "../search-listing";

const MyAppointments = () => {
    const navigate = useNavigate();
    return (
        <PageWrap
            onBack={() => {
                navigate(-1);
            }}
            withBack
            label="Appointment list"
        >
            <SearchListing isMyApp />
        </PageWrap>
    );
};

export default MyAppointments;
