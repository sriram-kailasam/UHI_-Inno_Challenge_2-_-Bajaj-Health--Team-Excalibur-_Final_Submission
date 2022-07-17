import { backIcon } from "../../images";
import "./styles.scss";

export interface IScreenHeader {
    label: string;
    onBack?: () => void;
    withBack: boolean;
}

const ScreenHeader = ({
    label = "",
    onBack,
    withBack = false,
}: IScreenHeader) => {
    return (
        <header className="screen-header">
            {withBack && (
                <div
                    className="back-icon-container"
                    onClick={typeof onBack === "function" ? onBack : () => {}}
                >
                    <img className="back-icon" src={backIcon} alt="back" />
                </div>
            )}
            <div className="label-container">
                <span className="label">{label}</span>
            </div>
        </header>
    );
};

export default ScreenHeader;
