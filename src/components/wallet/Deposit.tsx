import { useState } from "react";
import DepositInstan from "./DepositPage/DepositInstan";
import DepositNormal from "./DepositPage/DepositNormal";
import DepositPayID from "./DepositPage/DepositPayID";

interface IDepositProps {
  setDepositInstant: (instant: boolean) => void;
  scrollToTop: () => void;
  instant: boolean;
}

const Deposit = (props: IDepositProps) => {
  const [payId, setPayId] = useState(false);

  const selectPayId = () => {
    setPayId(true);
    props.scrollToTop();
  };

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-wrap gap-2 px-mobile md:px-10 lg:px-0">
        <button
          type="button"
          onClick={() => setPayId(false)}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition ${!payId ? "btn_primary" : "border border-[#B9D6FF]/20 text-[#D3F2FF]/70 hover:border-[#1AA9E7]"}`}
        >
          Bank / e-wallet
        </button>
        <button
          type="button"
          onClick={selectPayId}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition ${payId ? "btn_primary" : "border border-[#B9D6FF]/20 text-[#D3F2FF]/70 hover:border-[#1AA9E7]"}`}
        >
          PayID (AUD)
        </button>
      </div>
      {payId ? (
        <DepositPayID />
      ) : props.instant ? (
        <DepositInstan
          scrollToTop={props.scrollToTop}
          setDepositInstant={props.setDepositInstant}
        />
      ) : (
        <DepositNormal
          scrollToTop={props.scrollToTop}
          setDepositInstant={props.setDepositInstant}
        />
      )}
    </div>
  );
};

export default Deposit;
