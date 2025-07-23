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
