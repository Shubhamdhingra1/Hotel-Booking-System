import { useContext, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiUpload, FiImage, FiFileText, FiTruck, FiCalendar } from "react-icons/fi";
import Navbar from "../../components/Navbar/navbar";
import Footer from "../../components/Footer/footer";
import { AuthContext } from "../../Context/authContext";
import { fetchMyCarListings, resubmitCarListing, submitCarListing } from "../../features/travel/carListingApi";
import { uploadFileToCloudinary } from "../../shared/upload/cloudinaryUpload";
import { documentViewUrl } from "../../shared/upload/documentUrls";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./listYourCar.css";

const initialForm = {
  city: "",
  model: "",
  category: "Sedan",
  seats: 5,
  transmission: "Automatic",
  pricePerDay: "",
  pickupNote: "",
  description: "",
};

const ListYourCar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resubmitId = searchParams.get("resubmit");
  const [form, setForm] = useState(initialForm);
  const [carImages, setCarImages] = useState([]);
  const [carDocs, setCarDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [listingDates, setListingDates] = useState([
    { startDate: new Date(), endDate: new Date(Date.now() + 7 * 86400000), key: "selection" },
  ]);
  const [openDates, setOpenDates] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);

  useEffect(() => {
    if (!user || !resubmitId) return;
    (async () => {
      try {
        const res = await fetchMyCarListings();
        const existing = res.data.find((c) => c._id === resubmitId);
        if (!existing) return;
        setForm({
          city: existing.city || "",
          model: existing.model || "",
          category: existing.category || "Sedan",
          seats: existing.seats || 5,
          transmission: existing.transmission || "Automatic",
          pricePerDay: existing.pricePerDay || "",
          pickupNote: existing.pickupNote || existing.distance || "",
          description: existing.description || "",
        });
        setCarImages(existing.images?.length ? existing.images : existing.image ? [existing.image] : []);
        setCarDocs(existing.documents || []);
        if (existing.listFrom && existing.listUntil) {
          setListingDates([
            {
              startDate: new Date(existing.listFrom),
              endDate: new Date(existing.listUntil),
              key: "selection",
            },
          ]);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [user, resubmitId]);

  if (!user) {
    return (
      <div className="listYourCarPage pageShell">
        <Navbar />
        <div className="listYourCarMain">
          <h1>List your car</h1>
          <p>Please log in to submit a vehicle for admin approval.</p>
          <Link to="/login">Log in</Link>
        </div>
      </div>
    );
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setMessage(null);
    try {
      const uploaded = [];
      for (const file of files) {
        const result = await uploadFileToCloudinary(file);
        uploaded.push(result.url);
      }
      setCarImages((prev) => [...prev, ...uploaded]);
    } catch {
      setMessage({ type: "err", text: "Image upload failed. Try again." });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDocFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setMessage(null);
    try {
      const uploaded = [];
      const routedPhotos = [];
      for (const file of files) {
        const result = await uploadFileToCloudinary(file);
        if (file.type.startsWith("image/")) {
          routedPhotos.push(result.url);
          continue;
        }
        uploaded.push({
          name: result.originalName,
          url: result.url,
          mimeType: result.mimeType || "application/octet-stream",
        });
      }
      if (routedPhotos.length) {
        setCarImages((prev) => [...prev, ...routedPhotos]);
        setMessage({
          type: "ok",
          text: "Vehicle photos belong under Car photos — we moved them there. Upload PDFs under documents.",
        });
      }
      if (uploaded.length) {
        setCarDocs((prev) => [...prev, ...uploaded]);
      }
    } catch {
      setMessage({ type: "err", text: "Document upload failed. Try again." });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url) => setCarImages((prev) => prev.filter((u) => u !== url));
  const removeDoc = (url) => setCarDocs((prev) => prev.filter((d) => d.url !== url));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!carImages.length) {
      setMessage({ type: "err", text: "Upload at least one photo of your car." });
      return;
    }
    if (!carDocs.length) {
      setMessage({ type: "err", text: "Upload registration / insurance documents." });
      return;
    }
    const hasStoredDoc = carDocs.every((d) => d.url && d.url.startsWith("http"));
    if (!hasStoredDoc) {
      setMessage({ type: "err", text: "Wait for documents to finish uploading before submitting." });
      return;
    }
    if (!form.pickupNote.trim()) {
      setMessage({ type: "err", text: "Add a pick-up note for renters." });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const body = {
        ...form,
        seats: Number(form.seats),
        pricePerDay: Number(form.pricePerDay),
        images: carImages,
        image: carImages[0],
        documents: carDocs,
        listFrom: listingDates[0].startDate,
        listUntil: listingDates[0].endDate,
      };
      if (resubmitId) {
        await resubmitCarListing(resubmitId, body);
        setMessage({ type: "ok", text: "Submission updated — admin can review your files now." });
      } else {
        await submitCarListing(body);
        setMessage({ type: "ok", text: "Submitted for admin approval. Track status under My listings." });
      }
      setForm(initialForm);
      setCarImages([]);
      setCarDocs([]);
    } catch (err) {
      const text =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Could not submit listing.";
      setMessage({ type: "err", text });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="listYourCarPage pageShell">
      <Navbar />
      <div className="listYourCarMain">
        <header className="listYourCarHero">
          <h1>{resubmitId ? "Resubmit car listing" : "List your car for rent"}</h1>
          <p className="listYourCarIntro">
            Submit your vehicle for verification. Once approved, it appears in car rentals for the
            dates you choose.
          </p>
          <div className="listYourCarSteps">
            <span className="listYourCarStep">1 · Details</span>
            <span className="listYourCarStep">2 · Photos & docs</span>
            <span className="listYourCarStep">3 · Pick-up & dates</span>
          </div>
        </header>
        <form className="listYourCarForm" onSubmit={onSubmit}>
          <section className="listYourCarSection">
            <h2 className="listYourCarSectionTitle">
              <FiTruck aria-hidden /> Vehicle details
            </h2>
            <p className="listYourCarSectionSub">Information shown to renters after approval.</p>
          <div className="listYourCarRow">
            <label>
              City
              <input name="city" value={form.city} onChange={onChange} required placeholder="Mumbai" />
            </label>
            <label>
              Model
              <input name="model" value={form.model} onChange={onChange} required placeholder="Honda City" />
            </label>
          </div>
          <div className="listYourCarRow">
            <label>
              Category
              <select name="category" value={form.category} onChange={onChange}>
                <option>Sedan</option>
                <option>SUV</option>
                <option>Hatchback</option>
                <option>Luxury Sedan</option>
                <option>Executive Sedan</option>
              </select>
            </label>
            <label>
              Seats
              <input
                type="number"
                min={2}
                max={12}
                name="seats"
                value={form.seats}
                onChange={onChange}
                required
              />
            </label>
          </div>
          <div className="listYourCarRow">
            <label>
              Transmission
              <select name="transmission" value={form.transmission} onChange={onChange}>
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </label>
            <label>
              Price per day (₹)
              <input
                type="number"
                min={1}
                name="pricePerDay"
                value={form.pricePerDay}
                onChange={onChange}
                required
              />
            </label>
          </div>
          </section>

          <section className="listYourCarSection">
            <h2 className="listYourCarSectionTitle">
              <FiImage aria-hidden /> Photos & documents
            </h2>
            <p className="listYourCarSectionSub">Required for admin verification before your listing goes live.</p>

          <div className="listYourCarUploadBlock">
            <h4>Car photos</h4>
            <input
              ref={imageInputRef}
              className="listYourCarFileInput"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFiles}
              disabled={uploading}
            />
            <button
              type="button"
              className="listYourCarUploadBtn"
              disabled={uploading}
              onClick={() => imageInputRef.current?.click()}
            >
              <FiUpload aria-hidden /> Choose images
            </button>
            <p className="listYourCarUploadHint">Exterior, interior, and number plate (JPEG/PNG).</p>
            {carImages.length > 0 && (
              <div className="listYourCarPreviews">
                {carImages.map((url) => (
                  <div key={url} className="listYourCarPreviewItem">
                    <img src={url} alt="" />
                    <button type="button" onClick={() => removeImage(url)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="listYourCarUploadBlock">
            <h4>Registration & insurance</h4>
            <input
              ref={docInputRef}
              className="listYourCarFileInput"
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              multiple
              onChange={handleDocFiles}
              disabled={uploading}
            />
            <button
              type="button"
              className="listYourCarUploadBtn"
              disabled={uploading}
              onClick={() => docInputRef.current?.click()}
            >
              <FiFileText aria-hidden /> Upload documents
            </button>
            <p className="listYourCarUploadHint">
              RC, insurance, PUC — PDF preferred. Car exterior photos go in the section above.
            </p>
            {carDocs.length > 0 && (
              <ul className="listYourCarDocList">
                {carDocs.map((doc) => (
                  <li key={doc.url}>
                    <a
                      href={documentViewUrl(doc.url, doc.mimeType)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {doc.name}
                    </a>
                    <button type="button" onClick={() => removeDoc(doc.url)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          </section>

          <section className="listYourCarSection">
            <h2 className="listYourCarSectionTitle">
              <FiCalendar aria-hidden /> Pick-up & listing period
            </h2>
            <p className="listYourCarSectionSub">Tell renters where to meet you and when the ad runs.</p>

          <label>
            Pick-up note
            <textarea
              name="pickupNote"
              rows={3}
              value={form.pickupNote}
              onChange={onChange}
              required
              placeholder="Where and when renters can collect the keys — landmark, parking slot, contact on arrival..."
            />
          </label>

          <label>
            Message for admin (optional)
            <textarea
              name="description"
              rows={2}
              value={form.description}
              onChange={onChange}
              placeholder="Anything else we should know about the vehicle..."
            />
          </label>

          <div className="listYourCarDateRange">
            <label>Listing period (visible on site until end date)</label>
            <button type="button" className="dateInput" onClick={() => setOpenDates(!openDates)}>
              {`${format(listingDates[0].startDate, "dd/MM/yyyy")} – ${format(
                listingDates[0].endDate,
                "dd/MM/yyyy"
              )}`}
            </button>
            {openDates && (
              <DateRange
                minDate={new Date()}
                ranges={listingDates}
                onChange={(item) => setListingDates([item.selection])}
              />
            )}
          </div>
          </section>
          <button
            type="submit"
            className="listYourCarSubmit"
            disabled={saving || uploading}
          >
            {saving ? "Submitting…" : uploading ? "Uploading…" : "Submit for approval"}
          </button>
          {message && (
            <p className={`listYourCarMsg ${message.type}`}>{message.text}</p>
          )}
        </form>
        <div className="listYourCarFooterLinks">
          <Link to="/car-rentals/my-listings" className="listYourCarLink">
            View my car listings
          </Link>
          <button type="button" className="listYourCarLink" onClick={() => navigate("/car-rentals")}>
            Back to car rentals
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListYourCar;
