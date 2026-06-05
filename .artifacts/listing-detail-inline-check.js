
    (function () {
      const container = document.querySelector(".detail-container");
      if (!container) return;

      const htmlDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
      if (!htmlDescriptor || typeof htmlDescriptor.set !== "function") return;

      function safeTextValue(value) {
        return String(value ?? "").trim();
      }

      function hasRenderableListing() {
        const listing = window.resolvedListing || {};
        const mediaCount = typeof window.getListingImages === "function"
          ? window.getListingImages(listing).length
          : 0;

        return Boolean(
          listing._id ||
          listing.id ||
          safeTextValue(listing.title) ||
          mediaCount > 0 ||
          document.getElementById("title")?.textContent?.trim() ||
          document.getElementById("price")?.textContent?.trim()
        );
      }

      Object.defineProperty(container, "innerHTML", {
        configurable: true,
        enumerable: true,
        get() {
          return htmlDescriptor.get.call(this);
        },
        set(value) {
          const text = String(value || "");
          const isNotFoundMarkup =
            text.includes("İlan bulunamadı") ||
            text.includes("ilan bulunamadı") ||
            text.includes("yayında değil");

          if (isNotFoundMarkup && hasRenderableListing()) {
            console.warn("NOT_FOUND_OVERRIDE_BLOCKED", {
              listingId: window.resolvedListing?._id || window.resolvedListing?.id || "",
              title: window.resolvedListing?.title || "",
              mediaCount: typeof window.getListingImages === "function"
                ? window.getListingImages(window.resolvedListing || {}).length
                : 0
            });
            return;
          }

          htmlDescriptor.set.call(this, value);
        }
      });
    })();
  
