import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import copy from "copy-to-clipboard";
import { useDepositMutation } from "@framework/user/use-create-deposit";

const PAYID = process.env.NEXT_PUBLIC_PAYID_IDENTIFIER || "";
const PAYID_NAME = process.env.NEXT_PUBLIC_PAYID_ACCOUNT_NAME || "Parktheme";
const PAYID_BANK_ID = process.env.NEXT_PUBLIC_PAYID_BANK_ID || "payid";
const configuredMinimumAmount = Number(
  process.env.NEXT_PUBLIC_PAYID_MINIMUM_AMOUNT
);
const MINIMUM_AMOUNT =
  Number.isFinite(configuredMinimumAmount) && configuredMinimumAmount > 0
    ? configuredMinimumAmount
    : 10;

const createReference = () => {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PAYID-${Date.now().toString(36).toUpperCase()}-${random}`;
};

const DepositPayID = () => {
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState(() => createReference());
  const [submitted, setSubmitted] = useState(false);
  const { mutate, isLoading } = useDepositMutation(
    () => {
      setSubmitted(true);
      toast.success("PayID deposit submitted for verification.");
    },
    () => {
      toast.error("We could not create the PayID deposit. Please try again.");
    }
  );

  const numericAmount = Number(amount);
  const formattedAmount = useMemo(
    () =>
      Number.isFinite(numericAmount) && numericAmount > 0
        ? new Intl.NumberFormat("en-AU", {
            style: "currency",
            currency: "AUD",
          }).format(numericAmount)
        : "—",
    [numericAmount]
  );

  const copyValue = (value: string, message: string) => {
    copy(value);
    toast.success(message);
  };

  const submit = () => {
    if (!PAYID) {
      toast.error("PayID is not configured. Please contact support.");
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount < MINIMUM_AMOUNT) {
      toast.error(`Enter at least AUD ${MINIMUM_AMOUNT.toFixed(2)}.`);
      return;
    }

    // The existing API records this as pending. Only server-side staff/payment
    // reconciliation may confirm the transfer; the browser never marks it paid.
    mutate({
      amount: Math.round(numericAmount * 100) / 100,
      bank_id: PAYID_BANK_ID,
      player_bank_name: "PayID",
      player_bank_account_name: PAYID_NAME,
      player_bank_account_number: PAYID,
      bank_type: "payid",
      promotion_id: "",
      payment_reference: reference,
    });
  };

  return (
    <div className="bg_content_container flex w-full flex-col rounded-[10px] px-mobile py-6 text-white md:px-10 lg:px-12">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#1AA9E7]">
            PayID transfer
          </p>
          <h1 className="text-2xl font-semibold">Deposit with PayID</h1>
          <p className="mt-2 text-sm leading-6 text-[#D3F2FF]/65">
            PayID is a bank transfer, not an instant card charge. Your balance
            stays pending until the payment is matched and verified by the
            payment team.
          </p>
        </div>

        {!PAYID ? (
          <div className="rounded-md border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-100">
            PayID is currently unavailable because the merchant identifier has
            not been configured.
          </div>
        ) : null}

        <div className="space-y-5">
          <label className="block text-left">
            <span className="mb-2 block text-sm text-[#D3F2FF]/70">Amount (AUD)</span>
            <input
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value.replace(/[^0-9.]/g, ""));
                setSubmitted(false);
              }}
              inputMode="decimal"
              min={MINIMUM_AMOUNT}
              step="0.01"
              type="number"
              placeholder={`${MINIMUM_AMOUNT.toFixed(2)}`}
              className="h-12 w-full rounded-md border border-[#B9D6FF]/20 bg-[#071B2C] px-4 text-white outline-none transition focus:border-[#1AA9E7]"
              aria-describedby="payid-amount-help"
            />
            <span id="payid-amount-help" className="mt-2 block text-xs text-[#D3F2FF]/50">
              Minimum {new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(MINIMUM_AMOUNT)}. Transfer the exact amount shown.
            </span>
          </label>

          <div className="rounded-md border border-[#B9D6FF]/15 bg-[#d3f2ff0a] p-5 text-left">
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="text-sm text-[#D3F2FF]/65">Send exactly</span>
              <strong className="text-xl text-white">{formattedAmount}</strong>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-xs uppercase tracking-wide text-[#D3F2FF]/45">PayID</span>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <strong className="break-all">{PAYID || "Not configured"}</strong>
                  {PAYID ? (
                    <button type="button" onClick={() => copyValue(PAYID, "PayID copied.")} className="shrink-0 text-[#1AA9E7] hover:text-white">
                      Copy
                    </button>
                  ) : null}
                </div>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-[#D3F2FF]/45">Account name</span>
                <strong className="mt-1 block">{PAYID_NAME}</strong>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-[#D3F2FF]/45">Payment reference</span>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <strong className="break-all">{reference}</strong>
                  <button type="button" onClick={() => copyValue(reference, "Reference copied.")} className="shrink-0 text-[#1AA9E7] hover:text-white">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ol className="space-y-2 text-left text-sm text-[#D3F2FF]/70">
            <li><span className="mr-2 text-[#1AA9E7]">1.</span>Open your Australian banking app and choose PayID transfer.</li>
            <li><span className="mr-2 text-[#1AA9E7]">2.</span>Confirm the recipient name before sending the exact amount.</li>
            <li><span className="mr-2 text-[#1AA9E7]">3.</span>Use the payment reference above, then submit this form for matching.</li>
          </ol>

          <button
            type="button"
            disabled={isLoading || submitted || !PAYID}
            onClick={submit}
            className="btn_primary h-12 w-full rounded-md text-sm font-bold disabled:cursor-not-allowed disabled:bg-[#141414] disabled:text-gray"
          >
            {isLoading ? "Submitting…" : submitted ? "Awaiting payment verification" : "I have made the PayID transfer"}
          </button>

          {submitted ? (
            <div className="rounded-md border border-[#1AA9E7]/30 bg-[#1AA9E7]/10 p-4 text-left text-sm text-[#D3F2FF]/80">
              Your deposit is pending. Keep your bank receipt and reference <strong className="text-white">{reference}</strong> until the balance is updated.
              <button type="button" onClick={() => { setReference(createReference()); setAmount(""); setSubmitted(false); }} className="mt-3 block text-[#1AA9E7] hover:text-white">
                Start another PayID deposit
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DepositPayID;
