import { ISlot } from "../search-listing/doctor-mock";
import dayjs from "dayjs";

const Slots = ({
    slots,
    onSlotSelect,
    selectedSlotId,
}: {
    slots: ISlot[];
    onSlotSelect: (slotId: string) => void;
    selectedSlotId: string;
}) => (
    <div className="slots-container">
        {slots?.map((eachSlot) => {
            return (
                <div
                    className={`each-slot${
                        selectedSlotId === eachSlot.slotId ? " selected" : ""
                    }`}
                    onClick={() => {
                        onSlotSelect(eachSlot.slotId);
                    }}
                >
                    <span className="slot-label">
                        {dayjs(eachSlot.startTime).format("hh:mm A")}
                    </span>
                </div>
            );
        })}
    </div>
);

export default Slots;
