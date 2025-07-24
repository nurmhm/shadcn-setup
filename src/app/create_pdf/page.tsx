"use client";
import React, { useRef } from "react";
import jsPDF from "jspdf";

const PdfDocumentation = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = () => {
    const content = contentRef.current;
    if (!content) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    // সরাসরি HTML থেকে PDF তৈরি করুন
    pdf.html(content, {
      callback: function (pdf) {
        // PDF তৈরি হয়ে গেলে নতুন ট্যাবে খুলুন এবং প্রিন্ট ডায়ালগ দেখান
        const blob = pdf.output("blob");
        const blobUrl = URL.createObjectURL(blob);
        const newTab = window.open(blobUrl, "_blank");
        if (newTab) {
          newTab.onload = () => {
            newTab.focus();
            newTab.print();
          };
        }
      },
      // মার্জিন দেওয়ার জন্য x এবং y অক্ষের মান নির্ধারণ
      x: 10,
      y: 10,
      // কনটেন্টের প্রস্থ নির্ধারণ, এখানে পৃষ্ঠার প্রস্থ থেকে মার্জিন বাদ দেওয়া হয়েছে
      width: pageWidth - 20,
      // সোর্স এইচটিএমএল উপাদানের প্রস্থ দেওয়া জরুরি
      windowWidth: content.offsetWidth,
      // স্বয়ংক্রিয়ভাবে পৃষ্ঠা ভাঙার জন্য 'text' ব্যবহার করুন
      autoPaging: "text",
    });
  };

  return (
    <div className="p-8 min-h-screen space-y-6 bg-white text-black">
      {/* PDF বানানোর জন্য এই কন্টেইনারটি ব্যবহৃত হবে */}
      <div
        ref={contentRef}
        className="rounded-xl p-6 max-w-3xl mx-auto text-justify bg-white"
        // প্রিন্ট করার সময় যেন বর্ডার বা শ্যাডো না আসে, তার জন্য স্টাইল আলাদা করা যেতে পারে
        // তবে এই ডেমোর জন্য এটি ঠিক আছে।
      >
        <h1 className="text-3xl font-bold mb-6 text-center">hello</h1>
        {[...Array(80)].map((_, i) => (
          <p key={i} className="mb-2 text-base">
            {i + 1}. hello
          </p>
        ))}
        <p className="text-sm text-center mt-6">
          © {new Date().getFullYear()} Crafted with by Craftverse
        </p>
      </div>

      <div className="text-center">
        <button
          onClick={handleGeneratePDF}
          className="bg-black text-white px-6 py-3 rounded-lg shadow hover:bg-gray-800 transition"
        >
          ডকুমেন্টেশন PDF করো ও প্রিন্ট করো
        </button>
      </div>
    </div>
  );
};

export default PdfDocumentation;

// "use client";

// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { useRef, useState, forwardRef } from "react";

// import { baseURLRADSpaVewerForImage } from "@/lib/config";
// import { ReportDataType } from "@/types/reports";
// import Image from "next/image";
// import Link from "next/link";
// import React from "react";
// import { ArchiveRestoreIcon, FileBarChart, LogsIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";

// // Helper function অপরিবর্তিত
// const formatDateTime = (dateString: string | undefined) => {
//   if (!dateString) return "N/A";
//   return new Date(dateString).toLocaleString("en-GB", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// /**
//  * ReportTemplate: PDF এর জন্য HTML স্ট্রাকচার, এখন Tailwind CSS দিয়ে তৈরি।
//  * মাল্টি-পেজ রিপোর্টের ফুটারের সীমাবদ্ধতা এখনও প্রযোজ্য।
//  */
// const ReportTemplate = forwardRef<
//   HTMLDivElement,
//   { reportData: ReportDataType }
// >(({ reportData }, ref) => {
//   return (
//     // **চূড়ান্ত সমাধান:** এই ক্লাসগুলো টেমপ্লেটকে রেন্ডার করতে বাধ্য করে কিন্তু স্ক্রিনে দেখায় না।
//     <div ref={ref} className="absolute -left-[10000px] -top-[10000px]">
//       <div className="w-[210mm] min-h-[297mm]   font-sans text-[11pt] flex flex-col box-border">
//         {/* কন্টেন্ট র‍্যাপার */}
//         <div className="flex-grow p-[20mm] pb-0">
//           <header>
//             <h2 className="text-[16pt] font-bold text-center mb-5 uppercase">
//               {reportData?.modality === "CR"
//                 ? "CR Report"
//                 : reportData?.modality === "CT"
//                 ? "CT Report"
//                 : reportData?.modality === "DX"
//                 ? "Digital X-Ray Report"
//                 : reportData?.modality === "MG"
//                 ? "Mammography Report"
//                 : reportData?.modality === "MR"
//                 ? "MRI Report"
//                 : reportData?.modality === "PATHOLOGY"
//                 ? "Pathology Report"
//                 : reportData?.modality === "US"
//                 ? "Ultrasound Report"
//                 : reportData?.modality || "Report"}
//             </h2>
//           </header>

//           <main>
//             {/* রোগীর তথ্য */}
//             <div className="border  p-3 mt-5 grid grid-cols-2 gap-4">
//               {/* Column 1 */}
//               <div className="space-y-2">
//                 <div className="flex justify-between pb-1 border-b ">
//                   <span className="">Patient ID:</span>
//                   <span className="font-bold text-right ">
//                     {reportData?.patient_id || "N/A"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between pb-1 border-b ">
//                   <span className="">Patient Name:</span>
//                   <span className="font-bold text-right ">
//                     {reportData?.patient_name || "N/A"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between pb-1">
//                   <span className="">Age / Sex:</span>
//                   <span className="font-bold text-right ">{`${
//                     reportData?.age || "N/A"
//                   } / ${reportData?.gender || "N/A"}`}</span>
//                 </div>
//               </div>
//               {/* Column 2 */}
//               <div className="space-y-2">
//                 <div className="flex justify-between pb-1 border-b ">
//                   <span className="">Referring Doctor:</span>
//                   <span className="font-bold text-right ">
//                     {reportData?.referancing_physician || "N/A"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between pb-1 border-b ">
//                   <span className="">Study Date:</span>
//                   <span className="font-bold text-right ">
//                     {formatDateTime(reportData?.study_scan_time)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between pb-1">
//                   <span className="">Report Date:</span>
//                   <span className="font-bold text-right ">
//                     {new Date().toLocaleDateString("en-GB")}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* রিপোর্টের মূল অংশ */}
//             <div className="mt-6">
//               {/* prose ক্লাস ব্যবহার করলে ভিতরের HTML (h1, p, ul ইত্যাদি) সুন্দরভাবে ফরম্যাট হয়ে যায় */}
//               <div
//                 className="prose prose-sm max-w-none"
//                 dangerouslySetInnerHTML={{
//                   __html:
//                     reportData?.report_content ||
//                     "<p>No report content available.</p>",
//                 }}
//               />
//             </div>
//           </main>
//         </div>

//         {/* ফুটার */}
//         <footer className="shrink-0 p-[20mm] pt-2.5">
//           <div className="pt-4 border-t  flex justify-between items-end text-[10pt]">
//             <div className="text-center">
//               {reportData?.radiologist_signature && (
//                 <img
//                   crossOrigin="anonymous"
//                   src={reportData.radiologist_signature}
//                   alt="signature"
//                   className="w-[150px] h-auto mb-1 mx-auto"
//                 />
//               )}
//               <p className="border-t  pt-1 mt-1 font-bold">
//                 {reportData?.radiologist_name || "N/A"}
//               </p>
//               <p className="text-sm">
//                 {reportData?.radiologist_designation || ""}
//               </p>
//               <p className="text-sm italic ">Electronically Signed</p>
//             </div>
//             <div className="text-right">
//               <p className="italic ">
//                 Checked by Medical Technologist / Radiologist
//               </p>
//               <p className="mt-5 text-[8pt] ">
//                 *** This is a computer-generated report and does not require a
//                 physical signature. ***
//               </p>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// });
// ReportTemplate.displayName = "ReportTemplate";

// const ReportActions: React.FC<{ reportData: ReportDataType }> = ({
//   reportData,
// }) => {
//   const contentRef = useRef<HTMLDivElement>(null);
//   const [isPreparingPdf, setIsPreparingPdf] = useState(false);

//   const handleDownloadAndPrint = async () => {
//     const content = contentRef.current;
//     if (!content || isPreparingPdf) return;

//     setIsPreparingPdf(true);

//     try {
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();

//       await pdf.html(content, {
//         callback: function (doc) {
//           const blob = doc.output("blob");
//           const blobUrl = URL.createObjectURL(blob);
//           const newTab = window.open(blobUrl, "_blank");

//           if (newTab) {
//             newTab.onload = () => {
//               newTab.focus();
//               setTimeout(() => newTab.print(), 500);
//             };
//           } else {
//             alert(
//               "রিপোর্ট প্রিন্ট করার জন্য অনুগ্রহ করে এই সাইটের জন্য পপ-আপ অ্যালাউ করুন।"
//             );
//           }
//         },
//         x: 0,
//         y: 0,
//         width: pdfWidth,
//         windowWidth: content.scrollWidth,
//         autoPaging: "text",
//         // **উন্নত মানের PDF এর জন্য গুরুত্বপূর্ণ**
//         html2canvas: {
//           scale: 2, // রেজোলিউশন বাড়ায়
//           useCORS: true, // cross-origin ইমেজ (যেমন স্বাক্ষর) লোড করার জন্য
//           backgroundColor: "#ffffff", // সাদা ব্যাকগ্রাউন্ড নিশ্চিত করে
//         },
//       });
//     } catch (error) {
//       console.error("Failed to generate PDF", error);
//       alert("PDF তৈরিতে একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
//     } finally {
//       setIsPreparingPdf(false);
//     }
//   };

//   return (
//     <div className="flex items-center gap-4">
//       <ReportTemplate ref={contentRef} reportData={reportData} />
//       <button
//         className={`cursor-pointer transition-opacity duration-200 ${
//           isPreparingPdf ? "opacity-50 pointer-events-none" : "opacity-100"
//         }`}
//         onClick={handleDownloadAndPrint}
//         title="Print Report"
//       >
//         {isPreparingPdf ? (
//           <div className="w-[30px] h-[30px] flex items-center justify-center">
//             <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
//           </div>
//         ) : (
//           <Image
//             src="/images/printer_green.png"
//             alt="Print"
//             width={30}
//             height={30}
//           />
//         )}
//       </button>
//       {/* --- অন্যান্য অ্যাকশন আইকন --- */}
//       <div className="cursor-pointer" title="View Stats">
//         <FileBarChart size={25} className="text-green-500" />
//       </div>
//       <Link
//         href={`/dashboard/worklist/web-viewer/${reportData.metadata}`}
//         title="Web Viewer"
//       >
//         <Image
//           src="/images/webViewer.png"
//           alt="Web Viewer"
//           width={40}
//           height={40}
//         />
//       </Link>
//       <Link
//         href={`/dashboard/worklist/quick-vewer/${reportData.metadata}`}
//         title="Quick Viewer"
//       >
//         <Image
//           src="/images/dashboard.png"
//           alt="Quick Viewer"
//           width={40}
//           height={40}
//         />
//       </Link>
//       <Link
//         href={`${baseURLRADSpaVewerForImage}/${reportData.metadata}/"`}
//         title="RADSpa Viewer"
//       >
//         <Image
//           src="/images/skeleton.png"
//           alt="RADSpa Viewer"
//           width={30}
//           height={30}
//         />
//       </Link>
//       <Button variant="ghost" size="icon" className="h-8 w-8" title="View Logs">
//         <LogsIcon className="w-4 h-4" />
//       </Button>
//       <Button variant="ghost" size="icon" className="h-8 w-8" title="Restore">
//         <ArchiveRestoreIcon className="w-4 h-4" />
//       </Button>
//     </div>
//   );
// };

// export default ReportActions;
