/* ============================================================================
   AAKASH Test Centre — content registry
   ----------------------------------------------------------------------------
   Everything the site knows about exams lives here, so adding a new exam,
   subject or test never touches the engine (app.js).

   A question is:  { q, o:[4 options], a: answer index, e: explanation, t: topic }
   A bank is an array of questions, keyed by id under window.QUESTION_BANKS.
   A test answers a slice of a bank through { bank, range:[from, to] }.
   ========================================================================== */

window.QUESTION_BANKS = {

  /* --------------------------------------------------------------------- NEET · BIOLOGY (100 real questions from the original mock) */
  'neet-bio': [
    { q: 'What is the ploidy level of the central cell in the embryo sac before fertilization?', o: ['Haploid (n)', 'Diploid (2n)', 'Triploid (3n)', 'Tetraploid (4n)'], a: 1, t: 'Reproduction', e: 'The central cell has two polar nuclei (n+n), making it diploid (2n) before fertilization. After fertilization (with 1 male gamete) it becomes the triploid (3n) endosperm.' },
    { q: 'Which of the following is NOT a pollinating agent for flowers?', o: ['Bats', 'Snails', 'Earthworms', 'Water'], a: 2, t: 'Reproduction', e: 'Earthworms do not pollinate. Bats (chiropterophily), snails (malacophily) and water (hydrophily) are known pollinating agents.' },
    { q: 'Cleistogamous flowers are:', o: ['Self-pollinated and never open', 'Cross-pollinated by insects', 'Wind-pollinated', 'Sterile'], a: 0, t: 'Reproduction', e: 'Cleistogamous flowers (e.g. Viola) remain closed and self-pollinate, ensuring 100% seed set but no genetic variation.' },
    { q: 'The stamen in a flower represents:', o: ['Male reproductive part', 'Female reproductive part', 'Pollen tube', 'Seed coat'], a: 0, t: 'Reproduction', e: 'Stamen (anther + filament) is the male reproductive part. Pistil (stigma, style, ovary) is the female part.' },
    { q: 'Double fertilization in angiosperms involves:', o: ['Fusion of two male gametes with one egg', 'Fusion of one male gamete with egg and another with polar nuclei', 'Fusion of two eggs with one male gamete', 'Fusion of two polar nuclei with one male gamete'], a: 1, t: 'Reproduction', e: 'In double fertilization: 1 male gamete (n) + egg (n) → Zygote (2n); 1 male gamete (n) + 2 polar nuclei (n+n) → Endosperm (3n).' },
    { q: 'Apomixis is a type of:', o: ['Sexual reproduction', 'Asexual seed formation', 'Cross-pollination', 'Polyembryony'], a: 1, t: 'Reproduction', e: 'Apomixis is asexual seed formation without fertilization (e.g. in citrus, mango). It mimics sexual reproduction but bypasses meiosis.' },
    { q: 'Which hormone triggers ovulation in females?', o: ['FSH', 'LH', 'Progesterone', 'Estrogen'], a: 1, t: 'Reproduction', e: 'The LH surge from the pituitary gland triggers ovulation (release of the ovum from the Graafian follicle). FSH stimulates follicle growth, while progesterone prepares the uterus for implantation.' },
    { q: 'The acrosome of a sperm is derived from which cell organelle?', o: ['Nucleus', 'Mitochondria', 'Golgi apparatus', 'Centriole'], a: 2, t: 'Reproduction', e: 'The acrosome (contains enzymes like hyaluronidase for egg penetration) forms from the Golgi apparatus. Mitochondria power the sperm tail.' },
    { q: 'Which layer of the uterus is shed during menstruation?', o: ['Myometrium', 'Perimetrium', 'Endometrium', 'Basal layer'], a: 2, t: 'Reproduction', e: 'The endometrium (functional layer) is shed during menstruation if fertilization does not occur. The myometrium is the muscular layer.' },
    { q: 'Milk ejection in lactating mothers is stimulated by:', o: ['Prolactin', 'Oxytocin', 'Estrogen', 'Progesterone'], a: 1, t: 'Reproduction', e: 'Oxytocin causes milk ejection ("let-down reflex"), while prolactin stimulates milk production.' },
    { q: 'Which of the following is NOT a male accessory gland?', o: ['Seminal vesicle', 'Prostate gland', 'Bulbourethral gland', "Bartholin's gland"], a: 3, t: 'Reproduction', e: "Bartholin's gland is a female accessory gland (lubricates vagina). Male glands include seminal vesicles, prostate and bulbourethral glands." },
    { q: 'The fertilization membrane formed after sperm entry prevents:', o: ['Implantation', 'Polyspermy', 'Cleavage', 'Zygote formation'], a: 1, t: 'Reproduction', e: 'The cortical reaction post-fertilization forms a fertilization membrane to block polyspermy (entry of multiple sperm).' },
    { q: 'Which contraceptive method provides dual protection (prevents pregnancy + STDs)?', o: ['Copper-T', 'Oral contraceptive pills', 'Condoms', 'Diaphragm'], a: 2, t: 'Reproduction', e: 'Condoms (barrier method) prevent both pregnancy and STDs (HIV, gonorrhea). Other methods only prevent pregnancy.' },
    { q: 'Medical Termination of Pregnancy (MTP) is safest during:', o: ['First trimester (up to 12 weeks)', 'Second trimester (13-20 weeks)', 'Third trimester (after 26 weeks)', 'Any time with equal safety'], a: 0, t: 'Reproduction', e: 'MTP is safest in the first trimester (lower complications). After 20 weeks it is legally restricted except for fetal abnormalities.' },
    { q: 'Which STD is caused by a bacterium?', o: ['HIV/AIDS', 'Genital herpes', 'Syphilis', 'Hepatitis B'], a: 2, t: 'Reproduction', e: 'Syphilis is caused by Treponema pallidum (bacterium). Others are viral (HIV: retrovirus; Herpes: HSV; Hepatitis B: HBV).' },
    { q: 'Amniocentesis is used to detect:', o: ['Fetal heart defects', 'Genetic disorders (e.g. Down syndrome)', 'Maternal diabetes', 'Placental position'], a: 1, t: 'Reproduction', e: 'Amniocentesis analyzes amniotic fluid for chromosomal abnormalities (e.g. Trisomy 21). Misused for sex determination, now regulated in India.' },
    { q: "The 'Saheli' contraceptive pill contains:", o: ['Estrogen + Progesterone', 'Only Progesterone', 'Non-steroidal compound (Centchroman)', 'Mifepristone'], a: 2, t: 'Reproduction', e: 'Saheli contains Centchroman (non-steroidal, weekly pill). Regular pills have estrogen + progesterone.' },
    { q: 'Infertility treatment ICSI stands for:', o: ['Intra-Cervical Sperm Injection', 'Intra-Cytoplasmic Sperm Injection', 'In Vitro Sperm Isolation', 'Intra-Uterine Sperm Insertion'], a: 1, t: 'Reproduction', e: 'ICSI (Intra-Cytoplasmic Sperm Injection) injects sperm directly into the egg for IVF. Used in male infertility (low sperm count).' },
    { q: 'In Mendelian inheritance, the F2 generation of a monohybrid cross shows a phenotypic ratio of:', o: ['1:1', '3:1', '9:3:3:1', '1:2:1'], a: 1, t: 'Genetics', e: 'In a monohybrid cross (Aa × Aa), F2 shows 3:1 ratio (3 dominant : 1 recessive). The genotypic ratio is 1:2:1 (AA:Aa:aa).' },
    { q: 'A woman with blood group A (heterozygous) marries a man with blood group B (heterozygous). What is the chance of their child having blood group O?', o: ['0%', '25%', '50%', '75%'], a: 1, t: 'Genetics', e: 'Parents: IAi (A) × IBi (B). Possible offspring: IAIB (AB), IBi (B), IAi (A), ii (O) → 25% chance for O group.' },
    { q: 'Turner syndrome is caused by:', o: ['47, XXY', '45, X', '47, XYY', '47, XXX'], a: 1, t: 'Genetics', e: 'Turner syndrome is 45, X (monosomy X). Klinefelter syndrome is 47, XXY.' },
    { q: 'Which inheritance pattern shows both traits expressed equally in heterozygotes?', o: ['Incomplete dominance', 'Co-dominance', 'Pleiotropy', 'Polygenic inheritance'], a: 1, t: 'Genetics', e: 'In co-dominance, both alleles are fully expressed (e.g. AB blood group). In incomplete dominance, blending occurs (e.g. pink flowers in snapdragons).' },
    { q: 'The law of independent assortment is applicable to genes located on:', o: ['Same chromosome', 'Non-homologous chromosomes', 'Sex chromosomes', 'Mitochondrial DNA'], a: 1, t: 'Genetics', e: 'Independent assortment applies to genes on different chromosomes (non-linked). Linked genes (same chromosome) violate this law.' },
    { q: 'Sickle-cell anemia is caused by a mutation in the gene coding for:', o: ['Alpha-globin chain', 'Beta-globin chain', 'Hemoglobinase enzyme', 'Iron transport protein'], a: 1, t: 'Genetics', e: 'Sickle-cell anemia results from a point mutation in the β-globin gene (Glu → Val at position 6).' },
    { q: "The 'transforming principle' in Griffith's experiment was later identified as:", o: ['Protein', 'DNA', 'RNA', 'Polysaccharide'], a: 1, t: 'Genetics', e: "Griffith's experiment (1928) showed bacterial transformation. Avery, MacLeod & McCarty (1944) proved DNA is the transforming material." },
    { q: 'In DNA replication, the Okazaki fragments are synthesized on the:', o: ['Leading strand', 'Lagging strand', 'Both strands', 'Template strand'], a: 1, t: 'Genetics', e: "Okazaki fragments are short DNA segments on the lagging strand (synthesized discontinuously in the 5'→3' direction)." },
    { q: 'The Human Genome Project was completed in:', o: ['1990', '2000', '2003', '2010'], a: 2, t: 'Genetics', e: 'The draft was released in 2000, but the complete sequence was achieved in April 2003.' },
    { q: 'Which enzyme is responsible for transcription in eukaryotes?', o: ['DNA polymerase', 'RNA polymerase II', 'Reverse transcriptase', 'Helicase'], a: 1, t: 'Genetics', e: 'RNA polymerase II transcribes protein-coding genes (mRNA). RNA pol I (rRNA) and III (tRNA) have other roles.' },
    { q: 'The sequence of DNA that codes for a functional product is called:', o: ['Intron', 'Exon', 'Cistron', 'Muton'], a: 2, t: 'Genetics', e: 'A cistron is a DNA segment coding for a polypeptide. Exons are coding sequences, but cistron refers to the functional unit.' },
    { q: 'The Wobble hypothesis explains:', o: ['DNA replication errors', 'Flexibility in tRNA-mRNA pairing', 'Transcription termination', 'Post-translational modifications'], a: 1, t: 'Genetics', e: "The wobble hypothesis (Crick) states that the 3rd base of tRNA's anticodon can pair loosely with mRNA, allowing one tRNA to recognize multiple codons." },
    { q: 'Which of the following provides direct evidence for evolution?', o: ['Homologous organs', 'Fossils', 'Analogous organs', 'Vestigial organs'], a: 1, t: 'Evolution', e: 'Fossils are the most direct evidence of evolution as they show extinct species and transitional forms (e.g. Archaeopteryx).' },
    { q: 'Industrial melanism in peppered moths is an example of:', o: ['Natural selection', 'Artificial selection', 'Genetic drift', 'Mutation'], a: 0, t: 'Evolution', e: 'Dark-colored moths survived better in polluted areas (directional selection), proving natural selection in action.' },
    { q: "The 'Miller-Urey experiment' demonstrated:", o: ['Origin of life from inorganic matter', 'Formation of coacervates', 'RNA as the first genetic material', 'Cosmic origin of life'], a: 0, t: 'Evolution', e: 'Miller-Urey (1953) simulated early Earth conditions and produced amino acids, supporting chemical evolution.' },
    { q: 'Adaptive radiation is best exemplified by:', o: ["Darwin's finches", 'Human evolution', 'Industrial melanism', 'Hardy-Weinberg equilibrium'], a: 0, t: 'Evolution', e: "Darwin's finches in the Galapagos show adaptive radiation—diversification from a common ancestor into varied niches." },
    { q: 'The Hardy-Weinberg principle requires all of the following conditions EXCEPT:', o: ['No mutation', 'Random mating', 'Small population size', 'No natural selection'], a: 2, t: 'Evolution', e: 'Hardy-Weinberg equilibrium requires a large population (small populations experience genetic drift).' },
    { q: 'Vestigial organs in humans include:', o: ['Appendix and wisdom teeth', 'Liver and pancreas', 'Heart and lungs', 'Kidneys and spleen'], a: 0, t: 'Evolution', e: 'Appendix (digestive role in herbivores) and wisdom teeth are vestigial. Other organs are functional.' },
    { q: 'Which of the following is an autoimmune disease?', o: ['Malaria', 'Rheumatoid arthritis', 'Cholera', 'Tuberculosis'], a: 1, t: 'Human health & disease', e: 'Rheumatoid arthritis is caused by the immune system attacking joint tissues. Malaria, cholera and TB are infectious diseases.' },
    { q: 'The Plasmodium parasite is transmitted by:', o: ['Male Anopheles mosquito', 'Female Anopheles mosquito', 'Aedes aegypti', 'Housefly'], a: 1, t: 'Human health & disease', e: 'Only female Anopheles mosquitoes transmit malaria (they require blood meals for egg development).' },
    { q: 'Histamine is released during allergic reactions by:', o: ['Mast cells', 'Macrophages', 'T-lymphocytes', 'Red blood cells'], a: 0, t: 'Human health & disease', e: 'Mast cells release histamine, causing allergy symptoms (itching, swelling). Antihistamines block this response.' },
    { q: 'Which cancer is associated with the Epstein-Barr virus (EBV)?', o: ['Lung cancer', 'Cervical cancer', "Burkitt's lymphoma", 'Leukemia'], a: 2, t: 'Human health & disease', e: "EBV is linked to Burkitt's lymphoma (a B-cell cancer). HPV causes cervical cancer, and smoking causes lung cancer." },
    { q: 'Widal test is used to diagnose:', o: ['Typhoid', 'Malaria', 'AIDS', 'Tuberculosis'], a: 0, t: 'Human health & disease', e: 'The Widal test detects antibodies against Salmonella typhi (typhoid). Malaria uses blood smear, AIDS uses ELISA/Western blot.' },
    { q: 'Ascariasis is caused by:', o: ['Ascaris lumbricoides (roundworm)', 'Taenia solium (tapeworm)', 'Plasmodium (protozoan)', 'Entamoeba histolytica (amoeba)'], a: 0, t: 'Human health & disease', e: 'Ascariasis is a roundworm infection (Ascaris lumbricoides). Symptoms include abdominal pain and malnutrition.' },
    { q: 'Which microorganism is used to produce statin drugs for lowering cholesterol?', o: ['Lactobacillus', 'Aspergillus terreus', 'Saccharomyces cerevisiae', 'Penicillium notatum'], a: 1, t: 'Microbes in human welfare', e: 'Statins (e.g. Lovastatin) are produced by the fungus Aspergillus terreus. They inhibit cholesterol synthesis in humans.' },
    { q: 'Swiss cheese gets its characteristic holes due to the action of:', o: ['Lactobacillus', 'Propionibacterium shermanii', 'Streptococcus thermophilus', 'Acetobacter aceti'], a: 1, t: 'Microbes in human welfare', e: 'Propionibacterium shermanii releases CO₂ during fermentation, creating holes in Swiss cheese.' },
    { q: 'Which bacterium is used as a biofertilizer for legumes?', o: ['Azotobacter', 'Rhizobium', 'Nostoc', 'Bacillus thuringiensis'], a: 1, t: 'Microbes in human welfare', e: 'Rhizobium forms root nodules in legumes and fixes atmospheric nitrogen (N₂ → NH₃).' },
    { q: 'Biogas production primarily involves:', o: ['Aerobic bacteria', 'Methanogenic archaea', 'Cyanobacteria', 'Yeast'], a: 1, t: 'Microbes in human welfare', e: 'Methanogens (e.g. Methanobacterium) convert organic waste into methane (CH₄) in biogas plants.' },
    { q: "The 'Roquefort cheese' is ripened using:", o: ['Penicillium roqueforti', 'Aspergillus niger', 'Trichoderma polysporum', 'Clostridium butylicum'], a: 0, t: 'Microbes in human welfare', e: 'Penicillium roqueforti gives Roquefort cheese its blue veins and distinct flavor.' },
    { q: 'Which microbe is used in bioremediation of oil spills?', o: ['Pseudomonas putida', 'Bacillus subtilis', 'Escherichia coli', 'Streptomyces griseus'], a: 0, t: 'Microbes in human welfare', e: "Pseudomonas putida degrades hydrocarbons in oil spills. It is a genetically engineered 'superbug'." },
    { q: "The 'ori' site in a plasmid is essential for:", o: ['Antibiotic resistance', 'DNA replication', 'Gene insertion', 'Protein synthesis'], a: 1, t: 'Biotechnology', e: 'The origin of replication (ori) is where DNA replication begins. Without ori, the plasmid cannot replicate in the host cell.' },
    { q: 'Which enzyme is used to cut DNA at specific sequences?', o: ['DNA ligase', 'Restriction endonuclease', 'DNA polymerase', 'Reverse transcriptase'], a: 1, t: 'Biotechnology', e: 'Restriction enzymes (e.g. EcoRI) cut DNA at specific palindromic sequences, producing sticky or blunt ends.' },
    { q: 'The polymerase chain reaction (PCR) requires all of the following EXCEPT:', o: ['DNA template', 'Primers', 'Restriction enzymes', 'Thermostable DNA polymerase'], a: 2, t: 'Biotechnology', e: 'PCR needs Taq polymerase, primers, dNTPs and a thermal cycler. Restriction enzymes are used in gene cloning, not PCR.' },
    { q: 'Electroporation is a method used for:', o: ['DNA sequencing', 'Gene transfer into host cells', 'Protein purification', 'DNA fingerprinting'], a: 1, t: 'Biotechnology', e: 'Electroporation uses electric pulses to create temporary pores in cell membranes for DNA uptake.' },
    { q: 'The selectable marker in pBR322 plasmid is:', o: ['lacZ gene', 'ampᵣ and tetᵣ genes', 'ori site', 'Promoter'], a: 1, t: 'Biotechnology', e: 'pBR322 has ampicillin (ampᵣ) and tetracycline (tetᵣ) resistance genes to screen transformed bacteria.' },
    { q: 'Gel electrophoresis separates DNA fragments based on:', o: ['Charge', 'Size', 'Sequence', 'Color'], a: 1, t: 'Biotechnology', e: 'DNA migrates toward the anode, with smaller fragments moving faster through the agarose gel.' },
    { q: 'The Ti plasmid is used to transfer genes into:', o: ['Animal cells', 'Plant cells', 'Bacteria', 'Fungi'], a: 1, t: 'Biotechnology', e: 'Ti plasmid (from Agrobacterium tumefaciens) is a natural vector for plant genetic engineering.' },
    { q: 'Southern blotting is used to detect:', o: ['RNA', 'DNA', 'Proteins', 'Carbohydrates'], a: 1, t: 'Biotechnology', e: 'Southern blot identifies DNA sequences. Northern blot (RNA), Western blot (proteins).' },
    { q: 'The first human hormone produced using recombinant DNA technology was:', o: ['Insulin', 'Growth hormone', 'Thyroxine', 'Estrogen'], a: 0, t: 'Biotechnology', e: 'Human insulin (1983) was the first rDNA therapeutic, produced in E. coli.' },
    { q: 'Gene gun is used for:', o: ['DNA sequencing', 'Transforming animal cells', 'Delivering DNA into plant cells', 'PCR amplification'], a: 2, t: 'Biotechnology', e: 'The gene gun shoots gold/tungsten particles coated with DNA into plant cells (biolistics).' },
    { q: 'Golden Rice is genetically modified to produce:', o: ['Vitamin A (β-carotene)', 'Vitamin C', 'Iron', 'Calcium'], a: 0, t: 'Biotechnology', e: 'Golden Rice contains genes from daffodil and bacteria to synthesize β-carotene (Vitamin A precursor), combating deficiency.' },
    { q: 'The Bt toxin is produced by:', o: ['Bacillus subtilis', 'Bacillus thuringiensis', 'Agrobacterium tumefaciens', 'Pseudomonas putida'], a: 1, t: 'Biotechnology', e: 'Bt cotton has cry genes from Bacillus thuringiensis that produce insecticidal proteins against bollworms.' },
    { q: 'RNA interference (RNAi) is used to:', o: ['Amplify DNA', 'Silence specific genes', 'Clone genes', 'Sequence genomes'], a: 1, t: 'Biotechnology', e: 'RNAi uses siRNA/miRNA to degrade target mRNA, blocking gene expression (e.g. pest-resistant crops).' },
    { q: 'The first transgenic cow produced milk containing:', o: ['Human insulin', 'Human growth hormone', 'Human alpha-lactalbumin', 'Blood clotting factor VIII'], a: 2, t: 'Biotechnology', e: 'Rosie (1997) produced human alpha-lactalbumin-enriched milk, more nutritious for infants.' },
    { q: 'ELISA detects:', o: ['DNA mutations', 'Antigen-antibody interactions', 'RNA sequences', 'Protein folding'], a: 1, t: 'Biotechnology', e: 'ELISA (Enzyme-Linked Immunosorbent Assay) detects proteins/pathogens (e.g. HIV, pregnancy tests) via antibodies.' },
    { q: 'CRISPR-Cas9 is a tool for:', o: ['DNA sequencing', 'Gene editing', 'Protein synthesis', 'Cell culture'], a: 1, t: 'Biotechnology', e: 'CRISPR-Cas9 is a genome editing system that cuts DNA at specific sites using guide RNA.' },
    { q: 'Gene therapy for ADA deficiency involves:', o: ['Injecting ADA enzyme', 'Bone marrow transplantation', 'Introducing functional ADA gene into lymphocytes', 'Oral antibiotics'], a: 2, t: 'Biotechnology', e: 'SCID patients receive a functional ADA gene via retroviral vectors into lymphocytes or stem cells.' },
    { q: 'Hirudin is produced in transgenic:', o: ['Sheep', 'E. coli', 'Brassica napus (mustard)', 'Tobacco'], a: 3, t: 'Biotechnology', e: 'Hirudin (blood anticoagulant) is produced in transgenic tobacco using the Hirudo medicinalis (leech) gene.' },
    { q: 'Bt brinjal resists:', o: ['Fruit borer', 'Aphids', 'Whiteflies', 'Bollworms'], a: 0, t: 'Biotechnology', e: 'Bt brinjal contains the cry1Ac gene to resist the fruit and shoot borer (Leucinodes orbonalis).' },
    { q: 'Molecular diagnosis of HIV uses:', o: ['PCR', 'Western blot', 'Both (A) and (B)', 'MRI'], a: 2, t: 'Biotechnology', e: 'HIV is diagnosed via PCR (detects viral RNA) and Western blot (confirms antibodies).' },
    { q: 'Transgenic mice are used to study:', o: ['Human diseases', 'Plant growth', 'Bacterial resistance', 'Viral replication'], a: 0, t: 'Biotechnology', e: "Knockout mice model human diseases (e.g. cancer, Alzheimer's) by disabling specific genes." },
    { q: 'A population with equal birth and death rates shows:', o: ['Exponential growth', 'Declining growth', 'Zero population growth', 'Logistic growth'], a: 2, t: 'Ecology', e: 'When birth rate = death rate, r (growth rate) = 0, leading to zero population growth.' },
    { q: 'Mutualism is best exemplified by:', o: ['Lichen (algae + fungus)', "Cuckoo laying eggs in crow's nest", 'Tapeworm in human intestine', 'Tiger eating a deer'], a: 0, t: 'Ecology', e: 'Lichen shows obligate mutualism—algae (photosynthesis) + fungus (shelter/minerals). Cuckoo is brood parasitism.' },
    { q: 'The logistic growth equation is:', o: ['dN/dt = rN', 'dN/dt = rN[(K-N)/K]', 'dN/dt = rN[K/(K-N)]', 'dN/dt = rN²'], a: 1, t: 'Ecology', e: 'Logistic growth accounts for carrying capacity (K): dN/dt = rN[(K-N)/K].' },
    { q: "Allen's rule states that mammals in colder climates have:", o: ['Larger body size', 'Shorter extremities', 'Thicker fur', 'Darker skin'], a: 1, t: 'Ecology', e: "Allen's rule: reduced ear/tail length minimizes heat loss in cold climates (e.g. Arctic fox)." },
    { q: "Gause's competitive exclusion principle states that:", o: ['Two species cannot coexist indefinitely', 'Predators control prey populations', 'Mutualists evolve together', 'Parasites harm hosts'], a: 0, t: 'Ecology', e: 'Two species with identical niches cannot coexist—one will outcompete the other.' },
    { q: 'Ecotone refers to:', o: ['A stable climax community', 'Transition zone between two biomes', 'Genetic drift in small populations', 'Nutrient cycling in ecosystems'], a: 1, t: 'Ecology', e: 'Ecotones are transitional zones (e.g. mangrove between terrestrial and marine ecosystems).' },
    { q: 'r-selected species are characterized by:', o: ['Low reproductive rate', 'Long lifespan', 'Early reproduction', 'High parental care'], a: 2, t: 'Ecology', e: 'r-strategists (e.g. bacteria, insects) produce many offspring quickly with minimal care.' },
    { q: 'Biome with maximum biodiversity is:', o: ['Tundra', 'Tropical rainforest', 'Desert', 'Taiga'], a: 1, t: 'Ecology', e: 'Tropical rainforests (near equator) have high rainfall, temperature and species diversity.' },
    { q: 'Parasitism differs from predation in that parasites:', o: ['Kill the host immediately', 'Are always smaller than the host', 'Do not harm the host', 'Live on/in host for prolonged periods'], a: 3, t: 'Ecology', e: 'Parasites (e.g. tapeworms) derive nutrients without immediately killing the host.' },
    { q: 'Aposematic coloration is seen in:', o: ['Stick insects', 'Monarch butterflies', 'Arctic hares', 'Chameleons'], a: 1, t: 'Ecology', e: 'Bright colors (e.g. Monarch butterfly) warn predators of toxicity (chemical defense).' },
    { q: 'Age pyramid of a declining population is:', o: ['Broad base, narrow top', 'Narrow base, broad top', 'Uniform width', 'Inverted'], a: 1, t: 'Ecology', e: 'A narrow base (few young) with a broad top (many elderly) indicates declining growth (e.g. Japan).' },
    { q: 'The ultimate source of energy in an ecosystem is:', o: ['Sun', 'Producers', 'Consumers', 'Decomposers'], a: 0, t: 'Ecology', e: 'All energy flows from the sun → captured by producers (plants) via photosynthesis.' },
    { q: 'Primary productivity is highest in:', o: ['Deserts', 'Grasslands', 'Tropical rainforests', 'Open oceans'], a: 2, t: 'Ecology', e: 'Tropical rainforests have maximum NPP (Net Primary Productivity) due to optimal temperature, rainfall and sunlight.' },
    { q: 'Detritus food chain starts with:', o: ['Green plants', 'Dead organic matter', 'Herbivores', 'Carnivores'], a: 1, t: 'Ecology', e: 'The detritus chain begins with dead organic material (e.g. leaf litter) → decomposed by microbes/fungi.' },
    { q: '10% law of energy transfer was given by:', o: ['Darwin', 'Lindeman', 'Odum', 'Haeckel'], a: 1, t: 'Ecology', e: 'Raymond Lindeman proposed that only ~10% of energy transfers between trophic levels (the rest is lost as heat).' },
    { q: "Humboldt's rule states that biodiversity increases:", o: ['Near the equator', 'Near the poles', 'With altitude', 'In deserts'], a: 0, t: 'Ecology', e: 'Latitudinal diversity gradient: species richness peaks near the equator (tropical regions).' },
    { q: 'Keystone species in an ecosystem is one that:', o: ['Has the most biomass', 'Is the top predator', 'Has a disproportionate impact on stability', 'Is the most abundant'], a: 2, t: 'Ecology', e: 'Keystone species (e.g. sea otters, wolves) maintain ecosystem balance disproportionately to their abundance.' },
    { q: 'Nitrogen fixation is performed by:', o: ['Nitrosomonas', 'Rhizobium', 'Pseudomonas', 'Nostoc'], a: 1, t: 'Ecology', e: 'Rhizobium (in legume root nodules) converts atmospheric N₂ → NH₃. Nostoc (cyanobacteria) also fixes nitrogen.' },
    { q: 'Eutrophication is caused by excess:', o: ['CO₂', 'Phosphates/Nitrates', 'Heavy metals', 'Oxygen'], a: 1, t: 'Ecology', e: 'Excess phosphates/nitrates (from fertilizers) cause algal blooms → oxygen depletion → dead zones.' },
    { q: 'Pioneer species in primary succession are:', o: ['Lichens', 'Grasses', 'Shrubs', 'Trees'], a: 0, t: 'Ecology', e: 'Lichens break bare rock into soil, enabling mosses/grasses to colonize later.' },
    { q: 'Standing crop refers to:', o: ['Total biomass at a trophic level', 'Energy flow in a food chain', 'Rate of decomposition', 'Nutrient cycling'], a: 0, t: 'Ecology', e: 'Standing crop = living biomass (g/m² or kg/m²) at a given time (e.g. 200 kg/ha of grass).' },
    { q: 'Ozone layer depletion is caused by:', o: ['CO₂', 'CFCs', 'Methane', 'Nitrous oxide'], a: 1, t: 'Ecology', e: 'Chlorofluorocarbons (CFCs) release chlorine radicals that destroy ozone (O₃) in the stratosphere.' },
    { q: "The 'Evil Quartet' of biodiversity loss includes all EXCEPT:", o: ['Habitat loss', 'Overexploitation', 'Climate change', 'Co-extinctions'], a: 2, t: 'Ecology', e: 'The Evil Quartet (Jared Diamond) includes habitat loss, overexploitation, invasive species and co-extinctions. Climate change is a modern threat, not part of the original quartet.' },
    { q: 'Biodiversity hotspots must meet which criteria?', o: ['≥0.5% endemic plants + ≥70% habitat loss', '≥1,500 endemic plants + ≥30% habitat loss', '≥5,000 total species + ≥50% habitat loss', '≥10% endemic animals + ≥90% habitat loss'], a: 1, t: 'Ecology', e: 'Hotspots require ≥1,500 endemic vascular plants and ≤30% intact habitat (i.e. ≥70% lost). Examples: Western Ghats, Sundaland.' },
    { q: 'The Red Data Book categorizes species as:', o: ['Endangered, Vulnerable, Rare, Extinct', 'Predator, Prey, Producer, Decomposer', 'Terrestrial, Aquatic, Aerial, Arboreal', 'Endemic, Exotic, Invasive, Keystone'], a: 0, t: 'Ecology', e: 'IUCN Red List categories: Extinct (EX), Critically Endangered (CR), Endangered (EN), Vulnerable (VU), Near Threatened (NT), Least Concern (LC).' },
    { q: 'Keoladeo National Park is famous for:', o: ['Tigers', 'Migratory birds', 'Rhinoceros', 'Lions'], a: 1, t: 'Ecology', e: 'Keoladeo (Bharatpur), Rajasthan is a UNESCO site for the Siberian crane and other migratory birds.' },
    { q: 'Project Tiger was launched in:', o: ['1951', '1973', '1991', '2001'], a: 1, t: 'Ecology', e: 'Project Tiger (1973) aims to conserve tigers in reserves like Corbett, Bandipur and Ranthambore.' },
    { q: 'Ex situ conservation includes:', o: ['National parks', 'Seed banks', 'Sacred groves', 'Wildlife corridors'], a: 1, t: 'Ecology', e: 'Ex situ = conservation outside natural habitat: seed banks (e.g. Svalbard Global Seed Vault), zoos, botanical gardens, cryopreservation.' },
    { q: 'Ramsar Convention protects:', o: ['Deserts', 'Wetlands', 'Forests', 'Coral reefs'], a: 1, t: 'Ecology', e: 'The Ramsar Convention (1971) conserves wetlands (e.g. Chilika Lake, Sundarbans). India has 75+ Ramsar sites.' },
    { q: 'Endemic species of the Western Ghats include:', o: ['Bengal tiger', 'Nilgiri tahr', 'Indian rhinoceros', 'Snow leopard'], a: 1, t: 'Ecology', e: 'Nilgiri tahr is endemic to the Western Ghats. Others: lion-tailed macaque, Malabar giant squirrel.' },
    { q: 'Chipko Movement was initiated to protect:', o: ['Tigers', 'Forests', 'Wetlands', 'Grasslands'], a: 1, t: 'Ecology', e: 'The Chipko Movement (1973) in Uttarakhand involved hugging trees to prevent deforestation by contractors.' }
  ],

  /* ------------------------------------------------------------------ NEET · PHYSICS */
  'neet-phy': [
    { q: 'Which of the following is the SI unit of force?', o: ['Newton', 'Joule', 'Watt', 'Pascal'], a: 0, t: 'Mechanics', e: 'Force is measured in newtons (1 N = 1 kg·m/s²).' },
    { q: "Newton's second law of motion gives the relation:", o: ['F = mv', 'F = ma', 'F = m/a', 'F = a/m'], a: 1, t: 'Mechanics', e: 'Force equals mass times acceleration, F = ma.' },
    { q: 'A body moving with uniform velocity has an acceleration of:', o: ['Zero', 'Constant non-zero', 'Increasing', 'Infinite'], a: 0, t: 'Mechanics', e: 'Uniform velocity means no change in speed or direction, so acceleration is zero.' },
    { q: 'The work done by the centripetal force in uniform circular motion is:', o: ['Maximum', 'Zero', 'Negative', 'Equal to kinetic energy'], a: 1, t: 'Mechanics', e: 'The centripetal force is always perpendicular to displacement, so work done is zero.' },
    { q: "The dimensional formula of Planck's constant is:", o: ['ML²T⁻¹', 'ML²T⁻²', 'MLT⁻¹', 'ML²T⁻³'], a: 0, t: 'Mechanics', e: 'h = energy × time, so its dimensions are ML²T⁻¹ (same as angular momentum).' },
    { q: "The escape velocity from Earth's surface is given by:", o: ['√(gR)', '√(2gR)', '2√(gR)', '√(gR/2)'], a: 1, t: 'Mechanics', e: 'Escape velocity vₑ = √(2gR) ≈ 11.2 km/s for Earth.' },
    { q: 'At the highest point of a projectile, the velocity is:', o: ['Zero', 'Maximum', 'Minimum (horizontal only)', 'Equal to initial velocity'], a: 2, t: 'Mechanics', e: 'Only the horizontal component remains at the top, so the speed is at its minimum.' },
    { q: 'The coefficient of restitution for a perfectly elastic collision is:', o: ['0', '1', '0.5', 'Infinity'], a: 1, t: 'Mechanics', e: 'For a perfectly elastic collision, e = 1 (relative speed of separation equals approach).' },
    { q: 'The moment of inertia of a solid sphere about its diameter is:', o: ['(2/5)MR²', '(1/2)MR²', '(2/3)MR²', 'MR²'], a: 0, t: 'Mechanics', e: 'A solid sphere of mass M and radius R has I = (2/5)MR² about a diameter.' },
    { q: 'The SI unit of pressure is:', o: ['Newton', 'Pascal', 'Joule', 'Bar'], a: 1, t: 'Mechanics', e: 'Pressure = force/area, measured in pascals (1 Pa = 1 N/m²).' },
    { q: 'The speed of sound is maximum in:', o: ['Vacuum', 'Air', 'Water', 'Solids'], a: 3, t: 'Waves & optics', e: 'Sound travels fastest in solids because of their high elasticity and close particle packing.' },
    { q: 'In a transverse wave, the particles of the medium vibrate:', o: ['Along the direction of propagation', 'Perpendicular to propagation', 'In circles', 'Randomly'], a: 1, t: 'Waves & optics', e: 'Transverse waves have particle motion perpendicular to the wave direction (e.g. light).' },
    { q: 'The focal length of a plane mirror is:', o: ['Zero', 'Infinity', 'Equal to its size', 'Negative'], a: 1, t: 'Waves & optics', e: 'A plane mirror has infinite focal length because parallel rays reflect with no convergence.' },
    { q: 'The SI unit of the power of a lens is:', o: ['Watt', 'Dioptre', 'Lumen', 'Candela'], a: 1, t: 'Waves & optics', e: 'Lens power (P = 1/f in metres) is measured in dioptres (D).' },
    { q: 'Total internal reflection occurs when light travels from:', o: ['Rarer to denser medium', 'Denser to rarer medium', 'Air to glass', 'Vacuum to water'], a: 1, t: 'Waves & optics', e: 'TIR requires light to go from a denser to a rarer medium beyond the critical angle.' },
    { q: 'The blue colour of the sky is due to:', o: ['Refraction', 'Scattering', 'Dispersion', 'Diffraction'], a: 1, t: 'Waves & optics', e: 'Rayleigh scattering of shorter (blue) wavelengths by air molecules makes the sky appear blue.' },
    { q: 'When a source of sound approaches a stationary observer, the apparent frequency:', o: ['Increases', 'Decreases', 'Stays the same', 'Becomes zero'], a: 0, t: 'Waves & optics', e: 'Due to the Doppler effect, the apparent frequency rises as the source approaches.' },
    { q: 'Interference of light demonstrates its:', o: ['Particle nature', 'Wave nature', 'Dual nature', 'Quantum nature'], a: 1, t: 'Waves & optics', e: 'Interference and diffraction are wave phenomena, proving the wave nature of light.' },
    { q: "In Young's double-slit experiment, the fringe width is directly proportional to:", o: ['Wavelength', 'Slit separation', '1/wavelength', 'Screen distance squared'], a: 0, t: 'Waves & optics', e: 'Fringe width β = λD/d, so it is proportional to wavelength λ.' },
    { q: 'The critical angle for total internal reflection depends on:', o: ['Intensity of light', 'Wavelength/colour', 'Amplitude', 'Slit width'], a: 1, t: 'Waves & optics', e: 'Since refractive index varies with wavelength, the critical angle differs for different colours.' },
    { q: "Coulomb's law states that the force between two charges varies as:", o: ['Directly as distance', 'Inversely as distance', 'Inversely as square of distance', 'Directly as square of distance'], a: 2, t: 'Electrodynamics', e: 'F = kq₁q₂/r², an inverse-square law.' },
    { q: 'The SI unit of electric charge is:', o: ['Ampere', 'Coulomb', 'Volt', 'Farad'], a: 1, t: 'Electrodynamics', e: 'Charge is measured in coulombs (1 C = 1 A·s).' },
    { q: "Kirchhoff's junction rule is based on the conservation of:", o: ['Energy', 'Charge', 'Momentum', 'Mass'], a: 1, t: 'Electrodynamics', e: 'The sum of currents entering a junction equals the sum leaving — conservation of charge.' },
    { q: 'The SI unit of capacitance is:', o: ['Henry', 'Farad', 'Ohm', 'Tesla'], a: 1, t: 'Electrodynamics', e: 'Capacitance C = Q/V is measured in farads (F).' },
    { q: 'The magnetic force on a charged particle moving parallel to a magnetic field is:', o: ['Maximum', 'Zero', 'qvB', 'Infinite'], a: 1, t: 'Electrodynamics', e: 'F = qvB sin θ; when the velocity is parallel to B, θ = 0, so F = 0.' },
    { q: "Lenz's law is a consequence of the conservation of:", o: ['Charge', 'Momentum', 'Energy', 'Mass'], a: 2, t: 'Electrodynamics', e: 'The induced current opposes the change producing it, obeying conservation of energy.' },
    { q: 'In the photoelectric effect, the stopping potential depends on:', o: ['Intensity of light', 'Frequency of light', 'Distance of source', 'Area of cathode'], a: 1, t: 'Modern physics', e: 'Stopping potential depends on frequency (via photon energy), not on intensity.' },
    { q: 'The work function of a metal is usually expressed in:', o: ['Joule only', 'Electron-volt', 'Watt', 'Newton'], a: 1, t: 'Modern physics', e: 'Work functions are conveniently measured in electron-volts (eV).' },
    { q: 'The half-life of a radioactive sample depends on:', o: ['Temperature', 'Pressure', 'The nature of the nucleus', 'Chemical state'], a: 2, t: 'Modern physics', e: 'Half-life is a nuclear property independent of temperature, pressure or chemical state.' },
    { q: 'The de Broglie wavelength of a particle is given by:', o: ['λ = h/p', 'λ = hp', 'λ = p/h', 'λ = h/p²'], a: 0, t: 'Modern physics', e: 'de Broglie wavelength λ = h/p, where p is the momentum.' }
  ],

  /* ------------------------------------------------------------------ NEET · CHEMISTRY */
  'neet-chem': [
    { q: 'The pH of neutral water at 25 °C is:', o: ['0', '7', '14', '1'], a: 1, t: 'Physical chemistry', e: 'At 25 °C, [H⁺] = 10⁻⁷ M, so pH = 7 for neutral water.' },
    { q: "The value of Avogadro's number is:", o: ['6.022 × 10²³', '3.14 × 10²³', '1.6 × 10⁻¹⁹', '9.8 × 10²³'], a: 0, t: 'Physical chemistry', e: "Avogadro's number is 6.022 × 10²³ entities per mole." },
    { q: 'The number of moles in 22 g of CO₂ (molar mass 44 g/mol) is:', o: ['0.25', '0.5', '1', '2'], a: 1, t: 'Physical chemistry', e: 'n = mass/molar mass = 22/44 = 0.5 mol.' },
    { q: 'The ideal gas equation is:', o: ['PV = nRT', 'PV = nT', 'P = nRT', 'PV² = nRT'], a: 0, t: 'Physical chemistry', e: 'The ideal gas law is PV = nRT, where R is the gas constant.' },
    { q: 'The SI unit of molarity is:', o: ['mol/kg', 'mol/L', 'g/L', 'mol'], a: 1, t: 'Physical chemistry', e: 'Molarity = moles of solute per litre of solution (mol/L).' },
    { q: 'For a spontaneous process, the change in entropy of the universe is:', o: ['Negative', 'Zero', 'Positive', 'Constant'], a: 2, t: 'Physical chemistry', e: 'The second law requires ΔS(universe) > 0 for a spontaneous process.' },
    { q: 'The first law of thermodynamics is a statement of the conservation of:', o: ['Mass', 'Energy', 'Momentum', 'Charge'], a: 1, t: 'Physical chemistry', e: 'ΔU = q + w expresses conservation of energy.' },
    { q: 'In a galvanic cell, oxidation takes place at the:', o: ['Cathode', 'Anode', 'Salt bridge', 'Voltmeter'], a: 1, t: 'Physical chemistry', e: 'Oxidation (loss of electrons) occurs at the anode; reduction at the cathode.' },
    { q: "According to Arrhenius, an acid is a substance that gives:", o: ['OH⁻ ions', 'H⁺ ions', 'Electrons', 'Protons to water only'], a: 1, t: 'Physical chemistry', e: 'Arrhenius acids release H⁺ ions in aqueous solution.' },
    { q: 'A catalyst increases the rate of a reaction by:', o: ['Increasing activation energy', 'Lowering activation energy', 'Changing the equilibrium constant', 'Increasing temperature'], a: 1, t: 'Physical chemistry', e: 'A catalyst provides an alternative path with lower activation energy; it does not change the equilibrium constant.' },
    { q: 'The general formula of alkanes is:', o: ['CnH2n', 'CnH2n+2', 'CnH2n-2', 'CnHn'], a: 1, t: 'Organic chemistry', e: 'Saturated hydrocarbons (alkanes) have the formula CnH2n+2.' },
    { q: 'The IUPAC name of CH₃COOH is:', o: ['Methanoic acid', 'Ethanoic acid', 'Propanoic acid', 'Ethanol'], a: 1, t: 'Organic chemistry', e: 'Two-carbon carboxylic acid is ethanoic acid (acetic acid).' },
    { q: 'The functional group present in alcohols is:', o: ['-CHO', '-OH', '-COOH', '-NH₂'], a: 1, t: 'Organic chemistry', e: 'Alcohols contain the hydroxyl group (-OH).' },
    { q: 'The hybridisation of carbon in benzene is:', o: ['sp', 'sp²', 'sp³', 'sp³d'], a: 1, t: 'Organic chemistry', e: 'Each carbon in benzene is sp² hybridised, forming a planar ring with delocalised π electrons.' },
    { q: 'The addition of hydrogen to an alkene in the presence of a catalyst is called:', o: ['Hydration', 'Hydrogenation', 'Halogenation', 'Oxidation'], a: 1, t: 'Organic chemistry', e: 'Hydrogenation adds H₂ across the double bond, converting an alkene to an alkane.' },
    { q: "Markownikoff's rule predicts the addition of HX to an alkene, where the hydrogen goes to the carbon with:", o: ['More hydrogens', 'Fewer hydrogens', 'More alkyl groups', 'No hydrogens'], a: 0, t: 'Organic chemistry', e: 'The negative part (X) adds to the more substituted carbon; H adds to the carbon with more hydrogens.' },
    { q: 'The reaction of an alcohol with a carboxylic acid produces:', o: ['Ester', 'Amide', 'Ketone', 'Aldehyde'], a: 0, t: 'Organic chemistry', e: 'Esterification: alcohol + carboxylic acid → ester + water.' },
    { q: "Tollens' reagent is used to test for:", o: ['Ketones', 'Aldehydes', 'Alcohols', 'Ethers'], a: 1, t: 'Organic chemistry', e: "Tollens' reagent gives a silver mirror with aldehydes, distinguishing them from ketones." },
    { q: 'The simplest ketone is:', o: ['Methanal', 'Propanone (acetone)', 'Ethanal', 'Butanone'], a: 1, t: 'Organic chemistry', e: 'Propanone (acetone) is the smallest ketone, requiring at least three carbons.' },
    { q: 'Benzene typically undergoes:', o: ['Electrophilic substitution', 'Nucleophilic substitution', 'Electrophilic addition', 'Free radical addition'], a: 0, t: 'Organic chemistry', e: 'Aromatic benzene prefers electrophilic substitution to retain its stable aromatic ring.' },
    { q: 'The modern periodic law is based on:', o: ['Atomic mass', 'Atomic number', 'Density', 'Valency'], a: 1, t: 'Inorganic chemistry', e: "Moseley's modern periodic law arranges elements by increasing atomic number." },
    { q: 'Elements of group 18 are called:', o: ['Alkali metals', 'Halogens', 'Noble gases', 'Transition metals'], a: 2, t: 'Inorganic chemistry', e: 'Group 18 elements (He, Ne, Ar…) are noble gases with filled valence shells.' },
    { q: 'The most electronegative element is:', o: ['Oxygen', 'Chlorine', 'Fluorine', 'Nitrogen'], a: 2, t: 'Inorganic chemistry', e: 'Fluorine has the highest electronegativity (4.0 on the Pauling scale).' },
    { q: 'Alkali metals have the general valence configuration:', o: ['ns¹', 'ns²', 'np¹', 'ns²np⁶'], a: 0, t: 'Inorganic chemistry', e: 'Group 1 metals have a single valence electron (ns¹), making them highly reactive.' },
    { q: 'Transition elements are characterised by:', o: ['Filled d-orbitals', 'Partially filled d-orbitals', 'Filled f-orbitals', 'No d-electrons'], a: 1, t: 'Inorganic chemistry', e: 'Transition metals have partially filled d-orbitals in their common oxidation states.' },
    { q: 'The oxidation state of Mn in KMnO₄ is:', o: ['+2', '+4', '+7', '+6'], a: 2, t: 'Inorganic chemistry', e: 'In KMnO₄: 1(+1) + 1(x) + 4(−2) = 0 → x = +7.' },
    { q: 'Lanthanides belong to the:', o: ['s-block', 'p-block', 'd-block', 'f-block'], a: 3, t: 'Inorganic chemistry', e: 'Lanthanides are f-block elements where the 4f orbitals are progressively filled.' },
    { q: 'The bonding in sodium chloride (NaCl) is:', o: ['Covalent', 'Ionic', 'Metallic', 'Coordinate'], a: 1, t: 'Inorganic chemistry', e: 'NaCl is ionic: electron transfer from Na to Cl forms Na⁺ and Cl⁻ ions.' },
    { q: 'The hybridisation of nitrogen in NH₃ is:', o: ['sp', 'sp²', 'sp³', 'sp³d'], a: 2, t: 'Inorganic chemistry', e: 'NH₃ has sp³ hybridisation with one lone pair, giving a pyramidal shape.' },
    { q: 'The allotrope of carbon that conducts electricity is:', o: ['Diamond', 'Graphite', 'Fullerene', 'Charcoal'], a: 1, t: 'Inorganic chemistry', e: 'Graphite conducts electricity because each carbon uses only three of four valence electrons in bonding, leaving delocalised electrons.' }
  ],

  /* ------------------------------------------------------------------ GATE ECE · subject-wise */
  'gate-em': [
    { q: 'The determinant of a 3 × 3 identity matrix is:', o: ['0', '1', '3', '9'], a: 1, t: 'Linear algebra', e: 'The identity matrix has determinant 1 in any dimension.' },
    { q: 'The eigenvalues of a real symmetric matrix are:', o: ['Always complex', 'Always real', 'Always equal', 'Always zero'], a: 1, t: 'Linear algebra', e: 'A real symmetric matrix has purely real eigenvalues and orthogonal eigenvectors.' },
    { q: 'The value of ∫₀^∞ e^(−x) dx is:', o: ['0', '1', '∞', 'e'], a: 1, t: 'Calculus', e: '∫ e^(−x) dx = −e^(−x); evaluating from 0 to ∞ gives 0 − (−1) = 1.' },
    { q: 'The Laplace transform of the unit step function u(t) is:', o: ['1', '1/s', 's', 'e^(−s)'], a: 1, t: 'Transforms', e: 'L{u(t)} = 1/s for Re(s) > 0.' },
    { q: 'The rank of a 3 × 3 identity matrix is:', o: ['0', '1', '2', '3'], a: 3, t: 'Linear algebra', e: 'All three rows are independent, so the rank equals 3.' },
    { q: 'For a continuous probability density function f(x), the integral ∫₋∞^∞ f(x) dx equals:', o: ['0', '0.5', '1', '∞'], a: 2, t: 'Probability', e: 'The total probability over all values of x is 1.' },
    { q: 'The derivative of sin x with respect to x is:', o: ['cos x', '−cos x', 'sin x', '−sin x'], a: 0, t: 'Calculus', e: 'd/dx (sin x) = cos x.' },
    { q: 'The value of lim(x→0) (sin x)/x is:', o: ['0', '1', '∞', 'Undefined'], a: 1, t: 'Calculus', e: 'A standard limit: as x → 0, (sin x)/x → 1.' }
  ],
  'gate-nt': [
    { q: "Kirchhoff's current law is based on the conservation of:", o: ['Energy', 'Charge', 'Flux', 'Momentum'], a: 1, t: 'Network laws', e: 'KCL states the algebraic sum of currents at a node is zero — a statement of charge conservation.' },
    { q: "Thevenin's equivalent of a linear network consists of:", o: ['A current source in parallel with a resistor', 'A voltage source in series with a resistor', 'Only a resistor', 'Only a voltage source'], a: 1, t: 'Theorems', e: "Thevenin's theorem replaces a network by V_th in series with R_th." },
    { q: 'The time constant of a series RC circuit is:', o: ['R/C', 'RC', 'C/R', '1/RC'], a: 1, t: 'Transients', e: 'The RC time constant τ = RC determines the charging/discharging rate.' },
    { q: 'A resistor is a:', o: ['Non-linear element', 'Linear bilateral element', 'Unilateral element', 'Active element'], a: 1, t: 'Elements', e: 'A resistor obeys Ohm’s law in both directions — linear and bilateral.' },
    { q: 'The number of independent KVL equations in a network equals the number of:', o: ['Nodes', 'Independent loops', 'Branches', 'Meshes plus nodes'], a: 1, t: 'Network laws', e: 'One independent KVL equation can be written for each independent loop (mesh).' },
    { q: 'The superposition theorem is applicable to:', o: ['Non-linear networks', 'Linear networks', 'Only DC circuits', 'Only AC circuits'], a: 1, t: 'Theorems', e: 'Superposition holds only for linear networks with multiple independent sources.' },
    { q: 'In a purely capacitive AC circuit, the current:', o: ['Lags the voltage by 90°', 'Leads the voltage by 90°', 'Is in phase with voltage', 'Leads by 180°'], a: 1, t: 'AC analysis', e: 'In a capacitor, current leads voltage by 90° (ICE).' },
    { q: 'Resonance in a series RLC circuit occurs when:', o: ['X_L = 0', 'X_C = 0', 'X_L = X_C', 'R = 0'], a: 2, t: 'AC analysis', e: 'At resonance X_L = X_C, so impedance is purely resistive and current is maximum.' }
  ],
  'gate-ss': [
    { q: 'The Fourier transform of a unit impulse δ(t) is:', o: ['1 (constant)', 'δ(ω)', '1/ω', '0'], a: 0, t: 'Fourier', e: 'The impulse contains all frequencies equally, so its transform is a constant 1.' },
    { q: 'A system is called LTI if it is:', o: ['Linear and time-invariant', 'Linear and causal', 'Stable and causal', 'Time-invariant and stable'], a: 0, t: 'System properties', e: 'LTI = Linear + Time-Invariant.' },
    { q: 'The Nyquist rate for a signal band-limited to f_m is:', o: ['f_m', '2f_m', 'f_m/2', '4f_m'], a: 1, t: 'Sampling', e: 'To avoid aliasing, the sampling frequency must be at least twice f_m.' },
    { q: 'The Laplace transform of e^(−at)u(t) is:', o: ['1/(s+a)', '1/(s−a)', 'a/(s+a)', '1/s²'], a: 0, t: 'Transforms', e: 'L{e^(−at)u(t)} = 1/(s+a), Re(s) > −a.' },
    { q: 'The energy of a continuous-time signal x(t) is:', o: ['∫|x(t)| dt', '∫|x(t)|² dt', '∫x(t) dt', '∑|x[n]|²'], a: 1, t: 'Signal energy', e: 'Energy E = ∫|x(t)|² dt; power is the time average of the squared magnitude.' },
    { q: 'A causal system produces an output that depends on:', o: ['Future inputs', 'Present and past inputs', 'Only future inputs', 'Only past inputs of any length'], a: 1, t: 'System properties', e: 'Causality: output depends only on present and past inputs, not the future.' },
    { q: 'The z-transform of the unit step u[n] is (for |z| > 1):', o: ['1/(1 − z⁻¹)', '1/(1 + z⁻¹)', 'z', '1/z'], a: 0, t: 'Transforms', e: 'Z{u[n]} = 1/(1 − z⁻¹) = z/(z − 1), with ROC |z| > 1.' },
    { q: 'Convolution in the time domain corresponds to ___ in the frequency domain.', o: ['Addition', 'Subtraction', 'Multiplication', 'Division'], a: 2, t: 'Convolution', e: 'The convolution theorem: time-domain convolution ↔ frequency-domain multiplication.' }
  ],
  'gate-dc': [
    { q: 'The number of states in a 4-bit binary counter is:', o: ['4', '8', '16', '32'], a: 2, t: 'Sequential logic', e: 'A 4-bit counter has 2⁴ = 16 distinct states.' },
    { q: 'Which gate is called a universal gate?', o: ['AND', 'OR', 'NAND', 'XOR'], a: 2, t: 'Logic gates', e: 'NAND (and NOR) can implement all basic gates, hence universal.' },
    { q: 'The binary representation of decimal 10 is:', o: ['1010', '1100', '1001', '1110'], a: 0, t: 'Number systems', e: '10 = 8 + 2 = 1010 in binary.' },
    { q: 'In Boolean algebra, A · A′ equals:', o: ['A', '1', '0', 'A′'], a: 2, t: 'Boolean algebra', e: 'A variable ANDed with its complement is always 0.' },
    { q: 'A JK flip-flop toggles its output when:', o: ['J = 0, K = 0', 'J = 1, K = 0', 'J = 0, K = 1', 'J = 1, K = 1'], a: 3, t: 'Sequential logic', e: 'With J = K = 1, the JK flip-flop toggles on every clock edge.' },
    { q: 'A multiplexer with 2ⁿ data inputs requires how many select lines?', o: ['2n', 'n', 'n²', 'n/2'], a: 1, t: 'Combinational logic', e: 'n select lines can address 2ⁿ inputs.' },
    { q: 'Gray code is preferred in some designs because it:', o: ['Increases speed', 'Avoids race conditions by changing one bit at a time', 'Uses fewer bits', 'Is easier to add'], a: 1, t: 'Number systems', e: 'Adjacent Gray codes differ in only one bit, reducing switching errors.' },
    { q: 'The 2’s complement of the 4-bit number 1010 is:', o: ['0101', '0110', '1011', '1001'], a: 1, t: 'Number systems', e: '1’s complement of 1010 is 0101; adding 1 gives 0110.' }
  ],
  'gate-ac': [
    { q: 'The input impedance of an ideal op-amp is:', o: ['Zero', 'Finite', 'Infinite', 'Negative'], a: 2, t: 'Op-amp', e: 'An ideal op-amp has infinite input impedance, drawing no input current.' },
    { q: 'The virtual ground concept of an op-amp implies that:', o: ['The output is zero', 'The input terminals are at nearly the same potential', 'The gain is zero', 'The input is grounded'], a: 1, t: 'Op-amp', e: 'With negative feedback, V⁺ ≈ V⁻ — a "virtual short" or virtual ground.' },
    { q: 'A common-emitter amplifier introduces a phase shift of:', o: ['0°', '90°', '180°', '360°'], a: 2, t: 'Amplifiers', e: 'The CE configuration inverts the output, giving a 180° phase shift.' },
    { q: 'The voltage gain of an ideal inverting op-amp is:', o: ['R_f/R_in', '−R_f/R_in', '1 + R_f/R_in', '−R_in/R_f'], a: 1, t: 'Op-amp', e: 'For an inverting amplifier, A_v = −R_f/R_in.' },
    { q: 'The CMRR of an ideal op-amp is:', o: ['0', '1', 'Infinite', 'Finite but small'], a: 2, t: 'Op-amp', e: 'An ideal op-amp rejects common-mode signals completely, so CMRR is infinite.' },
    { q: 'A PN junction diode conducts when it is:', o: ['Reverse biased', 'Forward biased', 'Unbiased', 'At breakdown only'], a: 1, t: 'Diodes', e: 'Forward bias reduces the barrier, allowing current to flow.' },
    { q: 'A Zener diode is mainly used for:', o: ['Rectification', 'Amplification', 'Voltage regulation', 'Oscillation'], a: 2, t: 'Diodes', e: 'A Zener diode operates in reverse breakdown to provide a stable reference voltage.' },
    { q: 'Negative feedback in an amplifier:', o: ['Reduces gain and stabilises it', 'Increases distortion', 'Reduces bandwidth', 'Makes it unstable'], a: 0, t: 'Feedback', e: 'Negative feedback lowers gain but improves stability, bandwidth and linearity.' }
  ],
  'gate-ed': [
    { q: 'In an intrinsic semiconductor, the electron and hole concentrations are:', o: ['n > p', 'n < p', 'n = p', 'Both zero'], a: 2, t: 'Semiconductors', e: 'In intrinsic material, thermal generation creates equal numbers of electrons and holes (n = p = nᵢ).' },
    { q: 'Doping a semiconductor with a pentavalent impurity produces:', o: ['p-type', 'n-type', 'Intrinsic', 'Insulator'], a: 1, t: 'Semiconductors', e: 'Pentavalent donors donate extra electrons, giving an n-type semiconductor.' },
    { q: 'In a p-type semiconductor, the Fermi level lies:', o: ['Near the conduction band', 'Near the valence band', 'Exactly at mid-gap', 'Above the conduction band'], a: 1, t: 'Semiconductors', e: 'Acceptor doping shifts the Fermi level toward the valence band.' },
    { q: 'The depletion region of a PN junction contains:', o: ['Only electrons', 'Only holes', 'Fixed immobile ions', 'Free carriers'], a: 2, t: 'PN junction', e: 'The depletion region has fixed charged ions and is depleted of mobile carriers.' },
    { q: 'A BJT is a:', o: ['Voltage-controlled device', 'Current-controlled device', 'Power device only', 'Unidirectional switch'], a: 1, t: 'BJT', e: 'The collector current is controlled by the base current, so a BJT is current-controlled.' },
    { q: 'A MOSFET is a:', o: ['Current-controlled device', 'Voltage-controlled device', 'Bipolar device', 'Unijunction device'], a: 1, t: 'MOSFET', e: 'The drain current is controlled by the gate-source voltage in a MOSFET.' },
    { q: 'The reverse saturation current of a diode roughly doubles for every:', o: ['1 °C rise', '10 °C rise', '50 °C rise', '100 °C rise'], a: 1, t: 'Diodes', e: 'Reverse saturation current approximately doubles for every 10 °C increase in temperature.' },
    { q: 'Zener breakdown in a diode is primarily due to:', o: ['Thermal generation', 'High electric field', 'Recombination', 'Diffusion'], a: 1, t: 'Diodes', e: 'Zener breakdown occurs at low reverse voltages due to a strong electric field that frees carriers (avalanche dominates at higher voltages).' }
  ],
  'gate-cs': [
    { q: 'For a unity negative-feedback system, the closed-loop transfer function is:', o: ['G(s)', 'G(s)/(1 + G(s))', '1 + G(s)', 'G(s)/(1 − G(s))'], a: 1, t: 'Modelling', e: 'Closed-loop T(s) = G(s)/(1 + G(s)) for unity feedback.' },
    { q: 'For a system to be stable, all poles must lie:', o: ['On the imaginary axis', 'In the right half s-plane', 'In the left half s-plane', 'At the origin'], a: 2, t: 'Stability', e: 'Stability requires all poles in the left half of the s-plane (negative real parts).' },
    { q: 'The steady-state error of a type-1 system for a unit step input is:', o: ['0', '1/K_v', '∞', '1'], a: 0, t: 'Steady-state error', e: 'A type-1 system tracks a step input with zero steady-state error.' },
    { q: 'Gain margin and phase margin are measures of:', o: ['Absolute stability only', 'Relative stability', 'Steady-state error', 'Bandwidth'], a: 1, t: 'Stability', e: 'Gain and phase margins indicate how far the system is from instability (relative stability).' },
    { q: 'A system with poles on the imaginary axis (and none in the right half) is:', o: ['Stable', 'Unstable', 'Marginally stable', 'Conditionally stable only'], a: 2, t: 'Stability', e: 'Poles on the jω axis give sustained oscillations — marginal stability.' },
    { q: 'The Routh-Hurwitz criterion is used to determine:', o: ['Frequency response', 'Absolute stability', 'Transient response', 'Gain margin'], a: 1, t: 'Stability', e: 'The Routh-Hurwitz array checks the number of right-half-plane poles without finding them.' },
    { q: 'The transfer function of a first-order system with time constant T is:', o: ['K/(1 + Ts)', 'K/(1 + T²s²)', 'Ks', 'K/s'], a: 0, t: 'Modelling', e: 'A first-order system is G(s) = K/(1 + Ts).' },
    { q: 'A proportional controller primarily affects:', o: ['System type', 'Steady-state error', 'Number of poles', 'Non-linearity'], a: 1, t: 'Controllers', e: 'Increasing gain reduces steady-state error but may reduce stability margin.' }
  ],
  'gate-comm': [
    { q: 'The modulation index m of an AM signal with A_m = 5 and A_c = 10 is:', o: ['0.5', '2', '5', '0.2'], a: 0, t: 'AM', e: 'm = A_m/A_c = 5/10 = 0.5.' },
    { q: 'The bandwidth of an AM signal with modulating frequency f_m is:', o: ['f_m', '2f_m', 'f_m/2', '4f_m'], a: 1, t: 'AM', e: 'AM has two sidebands (f_c ± f_m), so bandwidth = 2f_m.' },
    { q: 'Compared with AM, FM provides:', o: ['Lower bandwidth', 'Better noise immunity', 'Simpler circuits', 'Lower power'], a: 1, t: 'FM', e: 'FM is more resistant to amplitude noise because information is carried in frequency.' },
    { q: 'The sampling theorem requires the sampling frequency f_s to be at least:', o: ['f_m', '2f_m', '0.5f_m', '4f_m'], a: 1, t: 'Sampling', e: 'f_s ≥ 2f_m (Nyquist rate) avoids aliasing.' },
    { q: 'Quantization error in PCM decreases as:', o: ['The number of levels decreases', 'The number of levels increases', 'Bandwidth decreases', 'Power decreases'], a: 1, t: 'PCM', e: 'More quantization levels reduce the step size and thus the error.' },
    { q: "Shannon's channel capacity formula is:", o: ['C = B log₂(1 + SNR)', 'C = 2B log₂(SNR)', 'C = B·SNR', 'C = log₂(1 + B)'], a: 0, t: 'Information theory', e: 'Shannon capacity C = B log₂(1 + SNR) bits/s.' },
    { q: 'FM and PM are classified as:', o: ['Linear modulation', 'Angle modulation', 'Amplitude modulation', 'Pulse modulation'], a: 1, t: 'Angle modulation', e: 'Both vary the angle of the carrier, so they are angle-modulation schemes.' },
    { q: 'A signal-to-noise ratio of 10 corresponds to approximately:', o: ['1 dB', '3 dB', '10 dB', '100 dB'], a: 2, t: 'Noise', e: 'SNR(dB) = 10 log₁₀(10) = 10 dB.' }
  ],
  'gate-emt': [
    { q: 'In Maxwell’s equations, ∇·B = 0 implies:', o: ['Existence of magnetic monopoles', 'No magnetic monopoles', 'Gauss’s law for electricity', 'Faraday’s law'], a: 1, t: 'Maxwell', e: 'The divergence of B being zero means magnetic monopoles do not exist.' },
    { q: 'The speed of an electromagnetic wave in free space is:', o: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '1 × 10⁸ m/s', '3 × 10¹⁰ m/s'], a: 0, t: 'Wave propagation', e: 'c = 1/√(μ₀ε₀) ≈ 3 × 10⁸ m/s.' },
    { q: 'In a uniform plane wave, E and H are:', o: ['Parallel', 'Perpendicular to each other', 'Anti-parallel', 'Co-linear'], a: 1, t: 'Wave propagation', e: 'E, H and the direction of propagation are mutually perpendicular.' },
    { q: 'The intrinsic impedance of free space is approximately:', o: ['50 Ω', '75 Ω', '120π Ω (≈377 Ω)', '1000 Ω'], a: 2, t: 'Wave propagation', e: 'η₀ = √(μ₀/ε₀) = 120π ≈ 377 Ω.' },
    { q: 'The Poynting vector represents:', o: ['Power flow per unit area', 'Electric field energy', 'Magnetic flux', 'Charge density'], a: 0, t: 'Power', e: 'P = E × H gives the instantaneous power flow per unit area.' },
    { q: 'As frequency increases, the skin depth of a conductor:', o: ['Increases', 'Decreases', 'Stays constant', 'Becomes infinite'], a: 1, t: 'Skin effect', e: 'Skin depth δ ∝ 1/√f, so it decreases with increasing frequency.' },
    { q: 'Faraday’s law in differential form is:', o: ['∇×E = −∂B/∂t', '∇×H = J + ∂D/∂t', '∇·D = ρ', '∇·B = 0'], a: 0, t: 'Maxwell', e: "∇×E = −∂B/∂t expresses that a changing magnetic field induces an electric field." },
    { q: 'A TEM wave can propagate in:', o: ['A hollow rectangular waveguide', 'A coaxial line', 'A single conductor', 'Free space only'], a: 1, t: 'Transmission lines', e: 'TEM modes require at least two conductors, e.g. a coaxial line.' }
  ],
  'gate-ga': [
    { q: 'If 2x + 3 = 11, then the value of x is:', o: ['3', '4', '5', '6'], a: 1, t: 'Numerical reasoning', e: '2x = 8, so x = 4.' },
    { q: 'The next term in the series 2, 6, 12, 20, … is:', o: ['24', '28', '30', '36'], a: 2, t: 'Sequences', e: 'Differences are 4, 6, 8, so the next difference is 10: 20 + 10 = 30.' },
    { q: 'Choose the word most similar in meaning to "candid":', o: ['Deceitful', 'Frank', 'Cautious', 'Rude'], a: 1, t: 'Verbal ability', e: '"Candid" means honest and straightforward — frank.' },
    { q: 'She has been working here ___ 2010.', o: ['for', 'since', 'from', 'by'], a: 1, t: 'Grammar', e: '"Since" is used with a point in time; "for" with a duration.' },
    { q: 'The average of the numbers 2, 4, 6 and 8 is:', o: ['4', '5', '6', '7'], a: 1, t: 'Numerical reasoning', e: 'Sum = 20; average = 20/4 = 5.' },
    { q: 'A train 120 m long moving at 36 km/h crosses a pole in:', o: ['6 s', '10 s', '12 s', '15 s'], a: 2, t: 'Numerical reasoning', e: '36 km/h = 10 m/s; time = 120/10 = 12 s.' },
    { q: 'If A : B = 2 : 3 and B : C = 4 : 5, then A : C is:', o: ['8 : 15', '2 : 5', '3 : 4', '6 : 5'], a: 0, t: 'Ratio', e: 'A : B : C = 8 : 12 : 15, so A : C = 8 : 15.' },
    { q: 'Find the odd one out: 121, 144, 169, 200, 225.', o: ['121', '169', '200', '225'], a: 2, t: 'Sequences', e: 'All the others are perfect squares; 200 is not.' }
  ]
};

/* --------------------------------------------------------------------------
   Exam → subject → test registry. Ranges are [from, to) over a question bank.
   -------------------------------------------------------------------------- */
window.EXAM_DATA = [
  {
    id: 'neet',
    name: 'NEET',
    subtitle: 'National Eligibility cum Entrance Test',
    note: 'Physics · Chemistry · Biology',
    accent: '#4a6bff',
    accent2: '#8a2be2',
    subjects: [
      {
        id: 'neet-bio', name: 'Biology', tests: [
          { id: 'neet-bio-repro', title: 'Reproduction', duration: 18, marking: { correct: 1, wrong: 1 / 3 }, bank: 'neet-bio', range: [0, 18], level: 'Chapter test' },
          { id: 'neet-bio-genetics', title: 'Genetics & Molecular Basis of Inheritance', duration: 12, marking: { correct: 1, wrong: 1 / 3 }, bank: 'neet-bio', range: [18, 30], level: 'Chapter test' },
          { id: 'neet-bio-evolution', title: 'Evolution', duration: 6, marking: { correct: 1, wrong: 1 / 3 }, bank: 'neet-bio', range: [30, 36], level: 'Chapter test' },
          { id: 'neet-bio-health', title: 'Human Health & Disease', duration: 6, marking: { correct: 1, wrong: 1 / 3 }, bank: 'neet-bio', range: [36, 42], level: 'Chapter test' },
          { id: 'neet-bio-microbes', title: 'Microbes in Human Welfare', duration: 6, marking: { correct: 1, wrong: 1 / 3 }, bank: 'neet-bio', range: [42, 48], level: 'Chapter test' },
          { id: 'neet-bio-biotech', title: 'Biotechnology: Principles & Applications', duration: 21, marking: { correct: 1, wrong: 1 / 3 }, bank: 'neet-bio', range: [48, 69], level: 'Chapter test' },
          { id: 'neet-bio-ecology', title: 'Ecology & Environment', duration: 31, marking: { correct: 1, wrong: 1 / 3 }, bank: 'neet-bio', range: [69, 100], level: 'Chapter test' },
          { id: 'neet-bio-full', title: 'Full-Length Biology Mock', duration: 60, marking: { correct: 1, wrong: 1 / 3 }, bank: 'neet-bio', range: [0, 100], level: 'Full mock' }
        ]
      },
      {
        id: 'neet-phy', name: 'Physics', tests: [
          { id: 'neet-phy-1', title: 'Mechanics', duration: 10, marking: { correct: 1, wrong: 1 / 3 }, bank: 'neet-phy', range: [0, 10], level: 'Topic test' },
          { id: 'neet-phy-2', title: 'Waves & Optics', duration: 10, marking: { correct: 1, wrong: 1 / 3 }, bank: 'neet-phy', range: [10, 20], level: 'Topic test' },
          { id: 'neet-phy-3', title: 'Electrodynamics & Modern Physics', duration: 10, marking: { correct: 1, wrong: 1 / 3 }, bank: 'neet-phy', range: [20, 30], level: 'Topic test' }
        ]
      },
      {
        id: 'neet-chem', name: 'Chemistry', tests: [
          { id: 'neet-chem-1', title: 'Physical Chemistry', duration: 10, marking: { correct: 1, wrong: 1 / 3 }, bank: 'neet-chem', range: [0, 10], level: 'Topic test' },
          { id: 'neet-chem-2', title: 'Organic Chemistry', duration: 10, marking: { correct: 1, wrong: 1 / 3 }, bank: 'neet-chem', range: [10, 20], level: 'Topic test' },
          { id: 'neet-chem-3', title: 'Inorganic Chemistry', duration: 10, marking: { correct: 1, wrong: 1 / 3 }, bank: 'neet-chem', range: [20, 30], level: 'Topic test' }
        ]
      }
    ]
  },
  {
    id: 'gate',
    name: 'GATE',
    subtitle: 'Graduate Aptitude Test in Engineering',
    note: 'Electronics & Communication (EC) · subject-wise',
    accent: '#0ea5a4',
    accent2: '#22c55e',
    subjects: [
      { id: 'gate-em', name: 'Engineering Mathematics', tests: [{ id: 'gate-em-1', title: 'Engineering Mathematics', duration: 8, marking: { correct: 1, wrong: 1 / 3 }, bank: 'gate-em', range: [0, 8], level: 'Subject test' }] },
      { id: 'gate-nt', name: 'Network Theory', tests: [{ id: 'gate-nt-1', title: 'Network Theory', duration: 8, marking: { correct: 1, wrong: 1 / 3 }, bank: 'gate-nt', range: [0, 8], level: 'Subject test' }] },
      { id: 'gate-ss', name: 'Signals & Systems', tests: [{ id: 'gate-ss-1', title: 'Signals & Systems', duration: 8, marking: { correct: 1, wrong: 1 / 3 }, bank: 'gate-ss', range: [0, 8], level: 'Subject test' }] },
      { id: 'gate-dc', name: 'Digital Circuits', tests: [{ id: 'gate-dc-1', title: 'Digital Circuits', duration: 8, marking: { correct: 1, wrong: 1 / 3 }, bank: 'gate-dc', range: [0, 8], level: 'Subject test' }] },
      { id: 'gate-ac', name: 'Analog Circuits', tests: [{ id: 'gate-ac-1', title: 'Analog Circuits', duration: 8, marking: { correct: 1, wrong: 1 / 3 }, bank: 'gate-ac', range: [0, 8], level: 'Subject test' }] },
      { id: 'gate-ed', name: 'Electronic Devices', tests: [{ id: 'gate-ed-1', title: 'Electronic Devices', duration: 8, marking: { correct: 1, wrong: 1 / 3 }, bank: 'gate-ed', range: [0, 8], level: 'Subject test' }] },
      { id: 'gate-cs', name: 'Control Systems', tests: [{ id: 'gate-cs-1', title: 'Control Systems', duration: 8, marking: { correct: 1, wrong: 1 / 3 }, bank: 'gate-cs', range: [0, 8], level: 'Subject test' }] },
      { id: 'gate-comm', name: 'Communications', tests: [{ id: 'gate-comm-1', title: 'Communications', duration: 8, marking: { correct: 1, wrong: 1 / 3 }, bank: 'gate-comm', range: [0, 8], level: 'Subject test' }] },
      { id: 'gate-emt', name: 'Electromagnetics', tests: [{ id: 'gate-emt-1', title: 'Electromagnetics', duration: 8, marking: { correct: 1, wrong: 1 / 3 }, bank: 'gate-emt', range: [0, 8], level: 'Subject test' }] },
      { id: 'gate-ga', name: 'General Aptitude', tests: [{ id: 'gate-ga-1', title: 'General Aptitude', duration: 8, marking: { correct: 1, wrong: 1 / 3 }, bank: 'gate-ga', range: [0, 8], level: 'Subject test' }] }
    ]
  }
];
