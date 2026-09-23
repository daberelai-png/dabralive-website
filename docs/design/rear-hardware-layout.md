# Rear hardware layout rationale

The original image placed ports individually in the chassis and did not show motherboard I/O, a GPU bracket or PSU structure. Revised concept uses discrete mechanical areas: grouped motherboard I/O, separate two-slot graphics bracket, exhaust grille and PSU inlet/switch.

Two network ports are proposed on the motherboard, not a second PCIe expansion card. Compact boards with onboard dual LAN and one x16 expansion slot exist (ASRock Rack Z690D4ID-2T is a reference example, not a selected component or purchasing recommendation): https://www.asrockrack.com/general/productdetail.asp?Model=Z690D4ID-2T . Its exact I/O is not reproduced and the generated illustration is not a CAD fit validation.

Graphics-card display ports are not SDI inputs or a commitment to video capture/encoding. NVIDIA's RTX 5060 family supports DP/HDMI display output: https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5060-family/ . Exact GPU model and bracket layout remain unspecified.

Pending: choose actual board/GPU/PSU, validate riser or direct-slot arrangement, chassis dimensions, thermal performance and studio audio interface. A separate NIC is an alternative only if supported by the eventual motherboard and available expansion space. Analog motherboard jacks do not establish balanced/professional audio support.
