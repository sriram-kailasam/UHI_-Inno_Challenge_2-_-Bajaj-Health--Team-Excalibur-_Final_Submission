import { ScreenHeader } from "../../elements";
import { IScreenHeader } from "../../elements/screen-header";
import "./styles.scss";

interface IPageWrap extends IScreenHeader {
    children: JSX.Element;
}

const PageWrap = ({ label, withBack, onBack, children }: IPageWrap) => {
    return (
        <div className="page-wrap">
            <ScreenHeader label={label} onBack={onBack} withBack={withBack} />
            <div className="page-body">{children}</div>
        </div>
    );
};

export default PageWrap;
