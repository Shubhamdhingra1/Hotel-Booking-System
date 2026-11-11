import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import Navbar from "../../components/Navbar/navbar";
import { httpClient } from "../../shared/api/httpClient";
import CarListingDocuments, {
  getListingImages,
} from "../../components/CarListings/listingDocuments";
import "./carListings.css";

const CarListings = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteById, setNoteById] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get("/car/admin/pending");
      setPending(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const review = async (id, action) => {
    try {
      await httpClient.patch(`/car/admin/${id}/review`, {
        action,
        adminNote: noteById[id] || "",
      });
      await load();
    } catch (e) {
      window.alert(e.response?.data?.message || "Review failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="carListingsAdmin">
        <h1>Car listing approvals</h1>
        <p>Approve peer vehicles before they appear on the client car rental page.</p>
        {loading && <p>Loading…</p>}
        {!loading && pending.length === 0 && <p>No pending submissions.</p>}
        <div className="carListingsGrid">
          {pending.map((car) => {
            const photos = getListingImages(car);
            return (
              <article key={car._id} className="carListingReviewCard">
                <h2>
                  {car.model} — {car.city}
                </h2>
                <div className="carListingReviewMeta">
                  <p>
                    {car.category} · {car.transmission} · {car.seats} seats · ₹{car.pricePerDay} /
                    day
                  </p>
                  <p>
                    <strong>Pick-up:</strong> {car.pickupNote || car.distance || "—"}
                  </p>
                  <p>
                    <strong>Listing window:</strong>{" "}
                    {car.listFrom && car.listUntil
                      ? `${format(new Date(car.listFrom), "dd MMM yyyy")} – ${format(
                          new Date(car.listUntil),
                          "dd MMM yyyy"
                        )}`
                      : "—"}
                  </p>
                  {car.description && (
                    <p>
                      <strong>Owner note:</strong> {car.description}
                    </p>
                  )}
                </div>
                {photos.length > 0 && (
                  <div className="carListingPhotosBlock">
                    <h3>Car photos</h3>
                    <div className="carListingPhotos">
                      {photos.map((src) => (
                        <a key={src} href={src} target="_blank" rel="noreferrer">
                          <img src={src} alt="" className="carListingThumb" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <CarListingDocuments car={car} />
                <textarea
                  placeholder="Note to owner (optional)"
                  value={noteById[car._id] || ""}
                  onChange={(e) =>
                    setNoteById((prev) => ({ ...prev, [car._id]: e.target.value }))
                  }
                />
                <div className="carListingActions">
                  <button type="button" onClick={() => review(car._id, "approve")}>
                    Approve
                  </button>
                  <button
                    type="button"
                    className="reject"
                    onClick={() => review(car._id, "reject")}
                  >
                    Reject
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CarListings;
