package com.campusconnect.ai.service;

import com.campusconnect.ai.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class AIService {

    public AIStudyResponse explainConcept(String subject, String query) {
        String s = (subject != null) ? subject : "Computer Science";
        String q = (query != null && !query.isBlank()) ? query.trim() : "Core Principles";

        String intro = "Here is an in-depth academic explanation of \"" + q + "\" formulated for your study of " + s + ". "
                + "This concept plays a critical role in understanding both underlying theory and practical engineering implementation.";

        String code;
        if ("Computer Science".equalsIgnoreCase(s) || q.toLowerCase().contains("java") || q.toLowerCase().contains("polymorphism")) {
            code = "// Java Example: " + q + "\n"
                    + "abstract class ConceptBase {\n"
                    + "    abstract void execute();\n"
                    + "}\n\n"
                    + "public class ImplementationDemo extends ConceptBase {\n"
                    + "    @Override\n"
                    + "    void execute() {\n"
                    + "        System.out.println(\"Executing logic for: " + q + "\");\n"
                    + "    }\n\n"
                    + "    public static void main(String[] args) {\n"
                    + "        ConceptBase instance = new ImplementationDemo();\n"
                    + "        instance.execute();\n"
                    + "    }\n"
                    + "}";
        } else if ("Mathematics".equalsIgnoreCase(s)) {
            code = "// Mathematical Formulation for " + q + "\n"
                    + "Formula: f(x) = sum_{k=0}^{n} ( (f^(k)(a) / k!) * (x - a)^k )\n"
                    + "Condition: Valid in the radius of convergence |x - a| < R\n"
                    + "Complexity: Computable via standard numerical quadrature in O(n) steps.";
        } else if ("Electronics".equalsIgnoreCase(s)) {
            code = "// Hardware / Circuit Model for " + q + "\n"
                    + "Transfer Function H(s) = Y(s) / X(s) = omega_c^2 / (s^2 + 2*zeta*omega_c*s + omega_c^2)\n"
                    + "Sampling Criterion: f_s >= 2 * f_max (Nyquist-Shannon criteria)\n"
                    + "Bode Plot roll-off: -40 dB/decade in stopband.";
        } else {
            code = "// Analytical Model for " + q + " in " + s + "\n"
                    + "System equation: dX/dt = Alpha * X - Beta * Y\n"
                    + "Steady state equilibrium reached when gradient converges to zero.";
        }

        List<String> keyPoints = List.of(
                "Core syllabus concept frequently emphasized in semester mid-terms and finals.",
                "Enforces modular separation of concerns and theoretical correctness.",
                "Underpins real-world system architecture, ensuring maintainability and scalability.",
                "Compare with corresponding uploaded lecture notes for department-specific guidelines."
        );

        List<String> followups = List.of(
                "What are the common edge cases when applying " + q + "?",
                "How does " + q + " impact asymptotic performance or operational efficiency?",
                "Generate 3 practice exam questions on this topic"
        );

        return new AIStudyResponse(intro, code, keyPoints, followups);
    }

    public AISummarizeResponse summarizeDocument(MultipartFile file, String text, String originalFileName) {
        String fname = "uploaded_notes.pdf";
        if (file != null && file.getOriginalFilename() != null) {
            fname = file.getOriginalFilename();
        } else if (originalFileName != null) {
            fname = originalFileName;
        }

        String overview = "This document provides a rigorous overview of core engineering and academic principles. "
                + "It emphasizes architectural patterns, computational complexity, memory management, and practical exam problem-solving paradigms.";

        List<AISummarizeResponse.KeyConcept> keyConcepts = List.of(
                new AISummarizeResponse.KeyConcept(
                        "Polymorphism & Dynamic Dispatch",
                        "Enables dynamic runtime resolution of method calls via virtual method tables, decoupling interface from concrete implementation."
                ),
                new AISummarizeResponse.KeyConcept(
                        "Algorithmic Complexity & Bounds",
                        "Applies Big-O notation to establish formal upper and lower performance bounds on sorting, searching, and graph traversals."
                ),
                new AISummarizeResponse.KeyConcept(
                        "State Encapsulation & Invariants",
                        "Restricts direct field access through strict visibility qualifiers, safeguarding internal invariants from unauthorized mutation."
                ),
                new AISummarizeResponse.KeyConcept(
                        "Cache Locality & Memory Hierarchy",
                        "Optimizes contiguous memory layouts for CPU L1/L2 hardware prefetchers, minimizing cache misses during large data transformations."
                )
        );

        List<String> examFocus = List.of(
                "Differentiate compile-time static binding vs runtime dynamic dispatch with complete code snippets.",
                "Derive worst-case and average-case recurrence relations using Master Theorem.",
                "Solve memory footprint and pointer overhead calculations for contiguous vs node-based data structures."
        );

        return new AISummarizeResponse(fname, overview, keyConcepts, examFocus);
    }

    public List<AIQuizQuestion> generateQuiz(AIQuizRequest req) {
        String topic = (req.getTopic() != null) ? req.getTopic() : "Data Structures";
        String subject = (req.getSubject() != null) ? req.getSubject() : "Computer Science";

        List<AIQuizQuestion> questions = new ArrayList<>();

        if ("Algorithms".equalsIgnoreCase(topic) || "Data Structures".equalsIgnoreCase(topic) || "Computer Science".equalsIgnoreCase(subject)) {
            questions.add(new AIQuizQuestion(
                    1,
                    "What is the worst-case time complexity of searching an element in a balanced Binary Search Tree (AVL Tree)?",
                    List.of("O(1)", "O(log n)", "O(n)", "O(n log n)"),
                    1,
                    "In an AVL tree, heights are balanced such that tree height remains logarithmic O(log n), guaranteeing worst-case search in O(log n)."
            ));
            questions.add(new AIQuizQuestion(
                    2,
                    "Which of the following data structures operates strictly on a Last-In, First-Out (LIFO) order?",
                    List.of("Queue", "Stack", "Binary Heap", "Linked List"),
                    1,
                    "A Stack enforces the LIFO principle where the element added most recently is popped first."
            ));
            questions.add(new AIQuizQuestion(
                    3,
                    "What is the primary advantage of a Hash Table over a Binary Search Tree for search operations?",
                    List.of("Guaranteed sorted order", "Average O(1) time complexity for lookup", "Strict O(1) worst-case time complexity", "Requires zero additional memory"),
                    1,
                    "Hash tables achieve average O(1) lookup time via direct hash indexing, compared to O(log n) in a balanced BST."
            ));
            questions.add(new AIQuizQuestion(
                    4,
                    "Which sorting algorithm has a worst-case time complexity of O(n^2) but an average-case of O(n log n)?",
                    List.of("Merge Sort", "Heap Sort", "Quick Sort", "Radix Sort"),
                    2,
                    "Quick Sort has O(n log n) average time complexity, but can degrade to O(n^2) in the worst case when pivot selection is skewed."
            ));
            questions.add(new AIQuizQuestion(
                    5,
                    "In graph theory, Dijkstra's algorithm cannot be guaranteed to work correctly in the presence of what?",
                    List.of("Directed cycles", "Disconnected vertices", "Negative weight edges", "Dense connectivity"),
                    2,
                    "Dijkstra assumes edge weights are non-negative. Negative edge weights can invalidate the greedy shortest-path distance invariant."
            ));
        } else if ("Electronics".equalsIgnoreCase(subject)) {
            questions.add(new AIQuizQuestion(
                    1,
                    "According to the Nyquist-Shannon sampling theorem, what must be the minimum sampling rate?",
                    List.of("Equal to signal bandwidth", "Twice the highest frequency component", "Half of the highest frequency component", "Four times the carrier frequency"),
                    1,
                    "The sampling frequency must be at least twice the maximum frequency component present in the analog signal to avoid aliasing."
            ));
            questions.add(new AIQuizQuestion(
                    2,
                    "In an ideal operational amplifier, what is the input impedance?",
                    List.of("Zero", "50 Ohms", "1 MegaOhm", "Infinite"),
                    3,
                    "An ideal op-amp exhibits infinite input impedance, drawing zero input current into its input terminals."
            ));
            questions.add(new AIQuizQuestion(
                    3,
                    "Which gate represents the universal logic gate capable of constructing any Boolean function?",
                    List.of("AND", "OR", "NAND", "XOR"),
                    2,
                    "NAND (and NOR) gates are functionally complete universal gates capable of synthesizing any digital circuit."
            ));
        } else if ("Mathematics".equalsIgnoreCase(subject)) {
            questions.add(new AIQuizQuestion(
                    1,
                    "If the determinant of a square matrix A is equal to 0, what does it signify?",
                    List.of("A is invertible", "A is non-singular", "The rows/columns of A are linearly dependent", "All eigenvalues of A are positive"),
                    2,
                    "A determinant of 0 indicates the matrix is singular and its row/column vectors are linearly dependent."
            ));
            questions.add(new AIQuizQuestion(
                    2,
                    "What is the derivative of f(x) = ln(3x) with respect to x?",
                    List.of("1 / (3x)", "1 / x", "3 / x", "3 ln(x)"),
                    1,
                    "By the chain rule: d/dx[ln(3x)] = (1 / 3x) * 3 = 1 / x."
            ));
        } else {
            questions.add(new AIQuizQuestion(
                    1,
                    "What is the fundamental metric used to discount future cash flows to present value in finance?",
                    List.of("Weighted Average Cost of Capital (WACC)", "Gross Margin", "Current Ratio", "Inventory Turnover"),
                    0,
                    "WACC represents the firm's hurdle rate / cost of capital used to discount forecasted future free cash flows."
            ));
            questions.add(new AIQuizQuestion(
                    2,
                    "Which financial statement reports a company's financial position at a single specific point in time?",
                    List.of("Income Statement", "Cash Flow Statement", "Balance Sheet", "Statement of Retained Earnings"),
                    2,
                    "The Balance Sheet is a snapshot of assets, liabilities, and equity at a specific date, unlike flow statements covering a period."
            ));
        }

        return questions;
    }
}
