import { useNavigate } from "react-router-dom";
import PageWrap from "../page-wrap";
import SearchListing from "../search-listing";

const DoctorSearch = () => {
    const navigate = useNavigate();
    return (
        <PageWrap
            label="Doctors"
            withBack
            onBack={() => {
                navigate(-1);
            }}
        >
            <SearchListing />
        </PageWrap>
    );
};

export default DoctorSearch;
