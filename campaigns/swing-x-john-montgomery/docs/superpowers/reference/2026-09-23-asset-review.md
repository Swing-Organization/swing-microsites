# Asset review — The Sunday Edit

Reviewed 2026-09-23 for planning. This is a source inspection record, not a claim that a site has been built or media has passed release QA.

## Evidence and identifiers

The [inventory](2026-09-23-asset-inventory.json) records Drive IDs, ordinary source links, original filenames, byte sizes, SHA-256 checksums, image dimensions, and stable review keys.

All 30 images were downloaded through the connected Drive source and inspected in a contact sheet. Original files remain temporary working copies; implementation must retrieve or retain approved originals in its ignored source directory and verify checksums. No signed download URLs were saved in the repository.

## Image placement review

| Key | Observed content | Planned use |
| --- | --- | --- |
| C01 | Golfer shadow, club, and practice balls on grass | Spread 1, personal ritual detail |
| C02 | Two women seated together on the course, green and light styling | Main cover portrait |
| C03 | Two women on lawn in front of a clubhouse | Collaboration story |
| C04 | Cream knit/pleated styling beside golf equipment | Spread 2, small texture insert |
| C05 | Two women practising putting by the clubhouse | Spread 1 |
| C06 | Women in motion with embedded “Fair Club” wordmark | Spread 1, full frame, unchanged |
| C07 | Two dogs posed in chairs beside a golf cart | Spread 4, playful still life |
| C08 | Tailored preppy look and golf bag by clubhouse | Spread 4 |
| C09 | Golf cart against course landscape | Spread 3 |
| C10 | People around a cart, course setting | Spread 3 |
| C11 | Seated woman inside golf cart | Spread 3 |
| C12 | Clubhouse, trees, and golf equipment | Spread 4 |
| C13 | White golf look and visor on course | Spread 5 |
| C14 | Light outfit beside golf cart | Spread 5 |
| C15 | Navy collared top and white pleated skirt detail | Spread 2 |
| C16 | Navy/light styled look near a garden sculpture | Spread 5 |
| C17 | Full figure on course beneath open sky | Spread 6 |
| C18 | Woman and golf cart against dark greenery | Spread 6 |
| C19 | Light collared outfit by golf bag, full look | Secondary cover portrait |
| C20 | Backlit golfer with equipment | Spread 7 |
| C21 | Cap/portrait detail in warm light | Spread 7 |
| C22 | Green knit and white pleated styling detail | Spread 2, small insert |
| C23 | Light outfit beside cart in landscape | Spread 6 |
| C24 | Blue collared golf look in landscape | Spread 7 |
| P01 | Clara Dress back | Clara card secondary view |
| P02 | Clara Dress front | Clara card primary view |
| P03 | Kin Polo back | Kin card secondary view |
| P04 | Kin Polo front | Kin card primary view |
| P05 | Luisa Jacket back | Luisa card secondary view |
| P06 | Luisa Jacket front | Luisa card primary view |

These observations are for art direction, not final alternative text. Write final alt text after examining each image at its displayed size; describe relevant visible content without inferred identities or invented product attribution.

## Recorded user decision

The user explicitly instructed **“Retain the supplied image unchanged”** in response to the C06/Fair Club question. This resolves that specific source conflict. Keep its wordmark intact and include the image; do not ask again or silently retouch it.

## Source-name correction

The product sheet spells the back view “Lusia back.webp”. The supplied folder contains **Luisa back.webp**, Drive ID `1OTCQxZ4QYrr51rs8rQScQViOtqqgtkF_`, review key P05. Bind that exact file to Luisa Jacket.

## Typography and identity

No separate logo or font files were present in the reviewed campaign/creative/product folders. The proposed design uses a typeset collaboration lockup and treats approved local script/Baskerville-style fonts as a pre-build creative dependency. A question about existing brand files was sent; no answer was available when this record was prepared. Do not infer a named font or licence from the brief’s “sign paper house script” phrase.

## Video review status

Six MP4 files were retrieved and hashed; their aggregate original size is 104,520,683 bytes. Their names all begin “ScreenRecording”. AVFoundation could read metadata, including portrait dimensions and audio tracks, but frame extraction failed with “Cannot Decode” in this environment. No visual or audio approval is claimed, and this failure alone does not establish that the sources are damaged.

The implementation must inspect the actual clips in a working player and verify:
- whether screen-recording interface elements or unrelated frames appear;
- which complete clip/time range fits the editorial sequence;
- browser-compatible codec, orientation, and playback;
- audio content and any meaningful speech/text requiring captions;
- a source-derived poster, clean fallbacks, and the final compressed derivative.

Use a photography-led cover meanwhile. Video is still a tracked part of the creative brief; if no supplied clip is suitable, request a clean supplied replacement before calling that requirement complete. Do not generate or source a substitute.

## Planning review coverage

All 24 campaign images are assigned once: two cover images, 21 spread images, one story image. All six product images appear in the product section. Seven editorial spreads plus a story preserve the brief’s three main sections. No asset is excluded because it is visually inconvenient.

