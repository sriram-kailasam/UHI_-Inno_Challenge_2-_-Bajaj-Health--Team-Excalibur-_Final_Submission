import { useEffect } from "react";
import { ScreenHeader } from "../../elements";
import { IScreenHeader } from "../../elements/screen-header";
import { useAppDispatch } from "../../redux/hooks";
import { IUser, updateProfile } from "../../redux/slice/user";
import "./styles.scss";

interface IPageWrap extends IScreenHeader {
    children: JSX.Element;
}

const PageWrap = ({ label, withBack, onBack, children }: IPageWrap) => {
    const profileData = JSON.parse(
        localStorage.getItem("user-profile") || "{}"
    ) as IUser | null;
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (profileData) {
            dispatch(updateProfile({ profile: profileData }));
        }
    }, []);

    return (
        <div className="page-wrap">
            <ScreenHeader label={label} onBack={onBack} withBack={withBack} />
            <div className="page-body">{children}</div>
        </div>
    );
};

export default PageWrap;
