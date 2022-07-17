import dayjs from "dayjs";

export interface ISlot {
  slotId: string;
  startTime: string;
  endTime: string;
}

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
