import { ISlot } from "../search-listing/doctor-mock";
import dayjs from "dayjs";
import Loading from "../../elements/loading";

const Slots = ({
    slots,
    onSlotSelect,
    selectedSlotId,
    isLoading,
}: {
    slots: ISlot[];
    onSlotSelect: (slotId: string) => void;
    selectedSlotId: string;
    isLoading: boolean;
}) => {
    return (
        <div className="slots-container">
            {isLoading && <Loading />}
            {!isLoading && !slots?.length && <span>No Slots Found</span>}
            {slots?.map((eachSlot) => {
                return (
                    <div
                        className={`each-slot${
                            selectedSlotId === eachSlot.slotId
                                ? " selected"
                                : ""
                        }`}
                        onClick={() => {
                            onSlotSelect(eachSlot.slotId);
                        }}
                    >
                        <span className="slot-label">
                            {dayjs(eachSlot.startTime).format(
                                "hh:mm A, DD MMM"
                            )}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default Slots;
