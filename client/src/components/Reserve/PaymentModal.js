import { useMemo, useState } from 'react';
import { FiLock } from 'react-icons/fi';
import './payment.css';

const PaymentModal = ({
    onClose,
    onPaySuccess,
    nights,
    durationValue,
    durationLabel = 'Nights',
    showDurationRow = true,
    onDurationChange,
    selectedCount,
    totalAmount,
    isProcessing,
    summaryLines = [],
    countLabel = 'Rooms selected',
    backLabel = 'Back to room selection',
    showCountRow = true,
}) => {
    const [method, setMethod] = useState('card');
    const duration = durationValue ?? nights ?? 1;

    const handleDurationInput = (raw) => {
        if (!onDurationChange) return;
        const next = Math.max(1, Math.min(30, Number(raw) || 1));
        onDurationChange(next);
    };

    const formattedTotal = useMemo(
        () =>
            new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
            }).format(totalAmount),
        [totalAmount]
    );

    return (
        <div className="paymentOverlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="paymentModal" role="dialog" aria-labelledby="payment-title">
                <div className="paymentHeader">
                    <button type="button" className="paymentClose" onClick={onClose} aria-label="Close">
                        ×
                    </button>
                    <h2 id="payment-title">Complete your booking</h2>
                    <p>Secure checkout — demo payment only</p>
                    <div className="paymentSecure">
                        <FiLock size={14} />
                        <span>256-bit SSL · PCI DSS compliant (demo)</span>
                    </div>
                </div>
                <div className="paymentBody">
                    <div className="paymentSummary">
                        {summaryLines.map((row) => (
                            <div className="paymentSummaryRow" key={row.label}>
                                <span>{row.label}</span>
                                <span className="paymentSummaryValue">{row.value}</span>
                            </div>
                        ))}
                        {showCountRow && (
                            <div className="paymentSummaryRow">
                                <span>{countLabel}</span>
                                <span>{selectedCount}</span>
                            </div>
                        )}
                        {showDurationRow && (
                            <div className="paymentSummaryRow">
                                <span>{durationLabel}</span>
                                {onDurationChange ? (
                                    <input
                                        type="number"
                                        min={1}
                                        max={30}
                                        className="paymentDurationInput"
                                        value={duration}
                                        onChange={(e) => handleDurationInput(e.target.value)}
                                    />
                                ) : (
                                    <span>{duration}</span>
                                )}
                            </div>
                        )}
                        <div className="paymentSummaryRow">
                            <span>Total payable</span>
                            <span>{formattedTotal}</span>
                        </div>
                    </div>

                    <div className="paymentField">
                        <label htmlFor="pay-method">Payment method</label>
                        <select
                            id="pay-method"
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                        >
                            <option value="card">Credit / Debit card</option>
                            <option value="upi">UPI</option>
                            <option value="netbanking">Net banking</option>
                        </select>
                    </div>

                    {method === 'card' && (
                        <>
                            <div className="paymentBrands">
                                <span>VISA</span>
                                <span>MC</span>
                                <span>RUPAY</span>
                            </div>
                            <div className="paymentField">
                                <label htmlFor="card-name">Name on card</label>
                                <input id="card-name" type="text" placeholder="As printed on card" defaultValue="Shubham Dhingra" />
                            </div>
                            <div className="paymentField">
                                <label htmlFor="card-number">Card number</label>
                                <input
                                    id="card-number"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="4242 4242 4242 4242"
                                    defaultValue="4242 4242 4242 4242"
                                />
                            </div>
                            <div className="paymentRow2">
                                <div className="paymentField">
                                    <label htmlFor="card-exp">Expiry</label>
                                    <input id="card-exp" type="text" placeholder="MM/YY" defaultValue="12/28" />
                                </div>
                                <div className="paymentField">
                                    <label htmlFor="card-cvv">CVV</label>
                                    <input id="card-cvv" type="password" placeholder="•••" defaultValue="123" maxLength={4} />
                                </div>
                            </div>
                        </>
                    )}

                    {method === 'upi' && (
                        <div className="paymentField">
                            <label htmlFor="upi-id">UPI ID</label>
                            <input id="upi-id" type="text" placeholder="yourname@upi" defaultValue="guest@okaxis" />
                        </div>
                    )}

                    {method === 'netbanking' && (
                        <div className="paymentField">
                            <label htmlFor="bank">Bank</label>
                            <select id="bank" defaultValue="hdfc">
                                <option value="hdfc">HDFC Bank</option>
                                <option value="icici">ICICI Bank</option>
                                <option value="sbi">State Bank of India</option>
                            </select>
                        </div>
                    )}

                    <button
                        type="button"
                        className="paymentBtn"
                        disabled={isProcessing}
                        onClick={onPaySuccess}
                    >
                        {isProcessing ? 'Processing payment…' : `Pay now · ${formattedTotal}`}
                    </button>
                    <button type="button" className="paymentBtnSecondary" onClick={onClose}>
                        {backLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const PaymentSuccessModal = ({ onDone, amount }) => {
    const formattedTotal = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);

    return (
        <div className="paymentOverlay successOverlay">
            <div className="successModal" role="alertdialog">
                <div className="successIcon">✓</div>
                <h3>Payment successful</h3>
                <p>
                    {formattedTotal} was received. Your reservation is confirmed.
                </p>
                <button type="button" className="successBtn" onClick={onDone}>
                    Done
                </button>
            </div>
        </div>
    );
};

export default PaymentModal;
