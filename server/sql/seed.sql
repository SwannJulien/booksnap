INSERT INTO library (name) VALUES ('Preschool'),('Primary');

-- Class level: 0-10
INSERT INTO dewey_class (code, name) VALUES
('000', 'Computer science, information, and general works'),
('100', 'Philosophy and psychology'),
('200', 'Religion'),
('300', 'Social sciences'),
('400', 'Language'),
('500', 'Science'),
('600', 'Technology'),
('700', 'Arts and recreation'),
('800', 'Literature'),
('900', 'History and geography');

-- Division 000-099: Computer science, information and general works
INSERT INTO dewey_division (code, name, class_code) VALUES
('000', 'Computer science, knowledge, and systems', '000'),
('010', 'Bibliographies', '000'),
('020', 'Library and information sciences', '000'),
('030', 'Encyclopedias and books of facts', '000'),
('050', 'Magazines, journals and serials', '000'),
('060', 'Associations, organizations and museums', '000'),
('070', 'News media, journalism, and publishing', '000'),
('080', 'Quotations', '000'),
('090', 'Manuscripts and rare books', '000');

-- Division 100-199: Philosophy and psychology
('100', 'Philosophy and psychology', '100'),
('110', 'Metaphysics', '100'),
('120', 'Epistemology, causation and humankind', '100'),
('130', 'Paranormal phenomena', '100'),
('140', 'Specific philosophical schools', '100'),
('150', 'Psychology', '100'),
('160', 'Logic', '100'),
('170', 'Ethics (moral philosophy)', '100'),
('180', 'Ancient, medieval and eastern philosophy', '100'),
('190', 'Modern western philosophy', '100'),

-- Division 200-299: Religion
('200', 'Religion', '200'),
('210', 'Philosophy and theory of religion', '200'),
('220', 'Bible', '200'),
('230', 'Christianity, Christian theology', '200'),
('240', 'Christian moral and devotional theology', '200'),
('250', 'Christian orders and local Christian church', '200'),
('260', 'Christian social theology', '200'),
('270', 'History of Christianity and Christian denominations', '200'),
('280', 'Christian denominations and sects', '200'),
('290', 'Comparative religion and other religions', '200'),

-- Division 300-399: Social sciences
('300', 'Social sciences', '300'),
('310', 'Collections of general statistics', '300'),
('320', 'Political science', '300'),
('330', 'Economics', '300'),
('340', 'Law', '300'),
('350', 'Public administration and military science', '300'),
('360', 'Social problems and services, associations', '300'),
('370', 'Education', '300'),
('380', 'Commerce, communications and transportation', '300'),
('390', 'Customs, etiquette and folklore', '300'),

-- Division 400-499: Language
('400', 'Language', '400'),
('410', 'Linguistics', '400'),
('420', 'English and Old English', '400'),
('430', 'Germanic languages, German', '400'),
('440', 'Romance languages, French', '400'),
('450', 'Italian, Romanian and Rhaeto-Romanic', '400'),
('460', 'Spanish and Portuguese languages', '400'),
('470', 'Latin and other Italic languages', '400'),
('480', 'Hellenic languages, Classical Greek', '400'),
('490', 'Other languages', '400'),

-- Division 500-599: Pure sciences
('500', 'Pure sciences', '500'),
('510', 'Mathematics', '500'),
('520', 'Astronomy and allied sciences', '500'),
('530', 'Physics', '500'),
('540', 'Chemistry and allied sciences', '500'),
('550', 'Earth sciences', '500'),
('560', 'Paleontology, paleozoology', '500'),
('570', 'Life sciences, biology', '500'),
('580', 'Plants (botany)', '500'),
('590', 'Animals (zoology)', '500'),

-- Division 600-699: Technology (applied sciences)
('600', 'Technology (applied sciences)', '600'),
('610', 'Medicine and health', '600'),
('620', 'Engineering and allied operations', '600'),
('630', 'Agriculture and related technologies', '600'),
('640', 'Home economics and family living', '600'),
('650', 'Management and auxiliary services', '600'),
('660', 'Chemical engineering and related technologies', '600'),
('670', 'Manufacturing', '600'),
('680', 'Manufacture of products for specific uses', '600'),
('690', 'Buildings and construction', '600'),

-- Division 700-799: Arts, recreation and sports
('700', 'Arts, recreation and sports', '700'),
('710', 'Civic and landscape art', '700'),
('720', 'Architecture', '700'),
('730', 'Sculpture and related arts', '700'),
('740', 'Drawing and decorative arts', '700'),
('750', 'Painting and paintings', '700'),
('760', 'Graphic arts, printmaking and prints', '700'),
('770', 'Photography, digital imaging and computer art', '700'),
('780', 'Music', '700'),
('790', 'Recreational and performing arts', '700'),

-- Division 800-899: Literature
('800', 'Literature', '800'),
('810', 'American literature in English', '800'),
('820', 'English and Old English literatures', '800'),
('830', 'Literatures of Germanic languages', '800'),
('840', 'Literatures of Romance languages, French literature', '800'),
('850', 'Italian, Romanian and Rhaeto-Romanic literatures', '800'),
('860', 'Spanish and Portuguese literatures', '800'),
('870', 'Latin and other Italic literatures', '800'),
('880', 'Hellenic literatures, Classical Greek', '800'),
('890', 'Literatures of other languages', '800'),

-- Division 900-999: History and geography
('900', 'History and geography', '900'),
('910', 'Geography and travel', '900'),
('920', 'Biography, genealogy and insignia', '900'),
('930', 'History of ancient world to ca. 499', '900'),
('940', 'General history of Europe', '900'),
('950', 'General history of Asia', '900'),
('960', 'General history of Africa', '900'),
('970', 'General history of North America', '900'),
('980', 'General history of South America', '900'),
('990', 'General history of other areas', '900');

-- Category level: 0-1000
INSERT INTO dewey_category (code, name, division_code) VALUES
('000', 'Computer science, information and general works', '000'),
('001', 'Knowledge', '000'),
('002', 'The book (writing, libraries, and book-related topics)', '000'),
('003', 'Systems', '000'),
('004', 'Data processing and computer science', '000'),
('005', 'Computer programming, programs, and data', '000'),
('006', 'Special computer methods (e.g. AI, multimedia, VR)', '000');

INSERT INTO dewey_category (code, name, division_code) VALUES
('010', 'Bibliography', '010'),
('011', 'Bibliographies', '010'),
('012', 'Bibliographies of individuals', '010'),
('014', 'Bibliographies of anonymous and pseudonymous works', '010'),
('015', 'Bibliographies of works from specific places', '010'),
('016', 'Bibliographies of works on specific subjects', '010'),
('017', 'General subject catalogs', '010');

INSERT INTO dewey_category (code, name, division_code) VALUES
('020', 'Library and information sciences', '020'),
('021', 'Library relationships (with archives, information centers, etc.)', '020'),
('022', 'Administration of physical plant', '020'),
('023', 'Personnel management', '020'),
('025', 'Library operations', '020'),
('026', 'Libraries for specific subjects', '020'),
('027', 'General libraries', '020'),
('028', 'Reading and use of other information media', '020');

INSERT INTO dewey_category (code, name, division_code) VALUES
('030', 'General encyclopedic works', '030'),
('031', 'Encyclopedias in American English', '030'),
('032', 'Encyclopedias in English', '030'),
('033', 'Encyclopedias in other Germanic languages', '030'),
('034', 'Encyclopedias in French, Occitan, and Catalan', '030'),
('035', 'Encyclopedias in Italian, Romanian, and related languages', '030'),
('036', 'Encyclopedias in Spanish and Portuguese', '030'),
('037', 'Encyclopedias in Slavic languages', '030'),
('038', 'Encyclopedias in Scandinavian languages', '030'),
('039', 'Encyclopedias in other languages', '030');

INSERT INTO dewey_category (code, name, division_code) VALUES
('050', 'General serial publications', '050'),
('051', 'Serials in American English', '050'),
('052', 'Serials in English', '050'),
('053', 'Serials in other Germanic languages', '050'),
('054', 'Serials in French, Occitan, and Catalan', '050'),
('055', 'Serials in Italian, Romanian, and related languages', '050'),
('056', 'Serials in Spanish and Portuguese', '050'),
('057', 'Serials in Slavic languages', '050'),
('058', 'Serials in Scandinavian languages', '050'),
('059', 'Serials in other languages', '050');

INSERT INTO dewey_category (code, name, division_code) VALUES
('060', 'General organizations and museum science', '060'),
('061', 'Organizations in North America', '060'),
('062', 'Organizations in British Isles; in England', '060'),
('063', 'Organizations in central Europe; in Germany', '060'),
('064', 'Organizations in France and Monaco', '060'),
('065', 'Organizations in Italy and adjacent islands', '060'),
('066', 'Organizations in Iberian Peninsula and adjacent islands', '060'),
('067', 'Organizations in eastern Europe; in Russia', '060'),
('068', 'Organizations in other geographic areas', '060'),
('069', 'Museum science', '060');

INSERT INTO dewey_category (code, name, division_code) VALUES
('070', 'News media, journalism, and publishing', '070'),
('071', 'Newspapers in North America', '070'),
('072', 'Newspapers in British Isles; in England', '070'),
('073', 'Newspapers in central Europe; in Germany', '070'),
('074', 'Newspapers in France and Monaco', '070'),
('075', 'Newspapers in Italy and adjacent islands', '070'),
('076', 'Newspapers in Iberian peninsula and adjacent islands', '070'),
('077', 'Newspapers in eastern Europe; in Russia', '070'),
('078', 'Newspapers in Scandinavia', '070'),
('079', 'Newspapers in other geographic areas', '070');

INSERT INTO dewey_category (code, name, division_code) VALUES
('080', 'Quotations', '080'),
('081', 'Quotations in American English', '080'),
('082', 'Quotations in English', '080'),
('083', 'Quotations in other Germanic languages', '080'),
('084', 'Quotations in French, Occitan, and Catalan', '080'),
('085', 'Quotations in Italian, Romanian, and related languages', '080'),
('086', 'Quotations in Spanish and Portuguese', '080'),
('087', 'Quotations in Slavic languages', '080'),
('088', 'Quotations in Scandinavian languages', '080'),
('089', 'Quotations in other languages', '080');

INSERT INTO dewey_category (code, name, division_code) VALUES
('090', 'Manuscripts and rare books', '090'),
('091', 'Manuscripts', '090'),
('092', 'Block books', '090'),
('093', 'Incunabula', '090'),
('094', 'Printed books', '090'),
('095', 'Books notable for bindings', '090'),
('096', 'Books notable for illustrations', '090'),
('097', 'Books notable for ownership or origin', '090'),
('098', 'Prohibited works, forgeries, and hoaxes', '090'),
('099', 'Books notable for format', '090');

-- 100-199: Philosophy and psychology
INSERT INTO dewey_category (code, name, division_code) VALUES
('100', 'Philosophy and psychology', '100'),
('101', 'Theory of philosophy', '100'),
('102', 'Miscellany of philosophy', '100'),
('103', 'Dictionaries, encyclopedias, concordances of philosophy', '100'),
('104', 'Special topics of philosophy', '100'),
('105', 'Serial publications of philosophy', '100'),
('106', 'Organizations and management of philosophy', '100'),
('107', 'Education, research, related topics of philosophy', '100'),
('108', 'Groups of people in philosophy', '100'),
('109', 'Historical treatment of philosophy', '100');

INSERT INTO dewey_category (code, name, division_code) VALUES
('110', 'Metaphysics', '110'),
('111', 'Ontology', '110'),
('113', 'Cosmology (Philosophy of nature)', '110'),
('114', 'Space', '110'),
('115', 'Time', '110'),
('116', 'Change', '110'),
('117', 'Structure', '110'),
('118', 'Force and energy', '110'),
('119', 'Number and quantity', '110');

INSERT INTO dewey_category (code, name, division_code) VALUES
('120', 'Epistemology, causation and humankind', '120'),
('121', 'Epistemology (Theory of knowledge)', '120'),
('122', 'Causation', '120'),
('123', 'Determinism and indeterminism', '120'),
('124', 'Teleology', '120'),
('126', 'The self', '120'),
('127', 'The unconscious and the subconscious', '120'),
('128', 'Humankind', '120'),
('129', 'Origin and destiny of individual souls', '120');

INSERT INTO dewey_category (code, name, division_code) VALUES
('130', 'Paranormal phenomena', '130'),
('131', 'Psychic phenomena', '130'),
('133', 'Parapsychology and occultism', '130'),
('135', 'Dreams and mysteries', '130'),
('137', 'Divinatory graphology', '130'),
('138', 'Physiognomy', '130'),
('139', 'Phrenology', '130');

INSERT INTO dewey_category (code, name, division_code) VALUES
('140', 'Specific philosophical schools', '140'),
('141', 'Idealism and related systems', '140'),
('142', 'Critical philosophy', '140'),
('143', 'Bergsonism and intuitionism', '140'),
('144', 'Humanism and related systems', '140'),
('145', 'Sensationalism', '140'),
('146', 'Naturalism and related systems', '140'),
('147', 'Pantheism and related systems', '140'),
('148', 'Dogmatism, eclecticism, and syncretic systems', '140'),
('149', 'Other philosophical systems', '140');

INSERT INTO dewey_category (code, name, division_code) VALUES
('150', 'Psychology', '150'),
('151', 'Philosophical psychology', '150'),
('152', 'Sensory perception, movement, emotions, physiological drives', '150'),
('153', 'Conscious mental processes and intelligence', '150'),
('154', 'Subconscious and altered states and processes', '150'),
('155', 'Differential and developmental psychology', '150'),
('156', 'Comparative psychology', '150'),
('158', 'Applied psychology', '150'),
('159', 'Mathematical psychology', '150');

INSERT INTO dewey_category (code, name, division_code) VALUES
('160', 'Logic', '160'),
('161', 'Induction', '160'),
('162', 'Deduction', '160'),
('165', 'Fallacies and sources of error', '160'),
('166', 'Syllogisms', '160'),
('167', 'Hypotheses', '160'),
('168', 'Argument and persuasion', '160'),
('169', 'Analogy', '160');

INSERT INTO dewey_category (code, name, division_code) VALUES
('170', 'Ethics (moral philosophy)', '170'),
('171', 'Ethical systems', '170'),
('172', 'Political ethics', '170'),
('173', 'Ethics of family relationships', '170'),
('174', 'Professional and occupational ethics', '170'),
('175', 'Ethics of recreation, leisure, public performances', '170'),
('176', 'Ethics of sex and reproduction', '170'),
('177', 'Ethics of social relations', '170'),
('178', 'Ethics of consumption', '170'),
('179', 'Other ethical norms', '170');

INSERT INTO dewey_category (code, name, division_code) VALUES
('180', 'Ancient, medieval and eastern philosophy', '180'),
('181', 'Eastern philosophy', '180'),
('182', 'Pre-Socratic Greek philosophies', '180'),
('183', 'Sophistic, Socratic, and related Greek philosophies', '180'),
('184', 'Platonic philosophy', '180'),
('185', 'Aristotelian philosophy', '180'),
('186', 'Skeptic and Neoplatonic philosophies', '180'),
('187', 'Epicurean philosophy', '180'),
('188', 'Stoic philosophy', '180'),
('189', 'Medieval western philosophy', '180');

INSERT INTO dewey_category (code, name, division_code) VALUES
('190', 'Modern western philosophy', '190'),
('191', 'United States and Canada', '190'),
('192', 'British Isles', '190'),
('193', 'Germany and Austria', '190'),
('194', 'France', '190'),
('195', 'Italy', '190'),
('196', 'Spain and Portugal', '190'),
('197', 'Russia and Finland', '190'),
('198', 'Scandinavia', '190'),
('199', 'Other geographic areas', '190');

-- 200-299: Religion
INSERT INTO dewey_category (code, name, division_code) VALUES
('200', 'Religion', '200'),
('201', 'Religious sociology and anthropology', '200'),
('202', 'Doctrines', '200'),
('203', 'Public worship and other practices', '200'),
('204', 'Religious experience, life, practice', '200'),
('205', 'Religious ethics', '200'),
('206', 'Leaders and organization', '200'),
('207', 'Missions and religious education', '200'),
('208', 'Sources', '200'),
('209', 'Sects and reform movements', '200');

INSERT INTO dewey_category (code, name, division_code) VALUES
('210', 'Philosophy and theory of religion', '210'),
('211', 'Concepts of God', '210'),
('212', 'Existence, knowability, attributes of God', '210'),
('213', 'Creation', '210'),
('214', 'Theodicy', '210'),
('215', 'Science and religion', '210'),
('218', 'Humankind', '210'),
('219', 'Not assigned or no longer used', '210');

INSERT INTO dewey_category (code, name, division_code) VALUES
('220', 'Bible', '220'),
('221', 'Old Testament', '220'),
('222', 'Historical books of Old Testament', '220'),
('223', 'Poetic books of Old Testament', '220'),
('224', 'Prophetic books of Old Testament', '220'),
('225', 'New Testament', '220'),
('226', 'Gospels and Acts', '220'),
('227', 'Epistles', '220'),
('228', 'Revelation (Apocalypse)', '220'),
('229', 'Apocrypha and pseudepigrapha', '220');

INSERT INTO dewey_category (code, name, division_code) VALUES
('230', 'Christianity, Christian theology', '230'),
('231', 'God, Trinity, Godhead', '230'),
('232', 'Jesus Christ and his family', '230'),
('233', 'Humankind', '230'),
('234', 'Salvation and grace', '230'),
('235', 'Spiritual beings', '230'),
('236', 'Eschatology', '230'),
('237', 'Not assigned or no longer used', '230'),
('238', 'Creeds and catechisms', '230'),
('239', 'Apologetics and polemics', '230');

INSERT INTO dewey_category (code, name, division_code) VALUES
('240', 'Christian moral and devotional theology', '240'),
('241', 'Christian ethics', '240'),
('242', 'Devotional literature', '240'),
('243', 'Evangelistic writings for individuals and families', '240'),
('246', 'Use of art in Christianity', '240'),
('247', 'Church furnishings and related articles', '240'),
('248', 'Christian experience, practice, life', '240'),
('249', 'Christian observances in family life', '240');

INSERT INTO dewey_category (code, name, division_code) VALUES
('250', 'Christian orders and local Christian church', '250'),
('251', 'Preaching (Homiletics)', '250'),
('252', 'Texts of sermons', '250'),
('253', 'Pastoral office and work (Pastoral theology)', '250'),
('254', 'Parish administration', '250'),
('255', 'Religious congregations and orders', '250'),
('259', 'Pastoral care of families, of specific groups of people', '250');

INSERT INTO dewey_category (code, name, division_code) VALUES
('260', 'Christian social theology', '260'),
('261', 'Social theology', '260'),
('262', 'Ecclesiology', '260'),
('263', 'Days, times, places of religious observance', '260'),
('264', 'Public worship', '260'),
('265', 'Sacraments, other rites and acts', '260'),
('266', 'Missions', '260'),
('267', 'Associations for religious work', '260'),
('268', 'Religious education', '260'),
('269', 'Spiritual renewal', '260');

INSERT INTO dewey_category (code, name, division_code) VALUES
('270', 'History of Christianity and Christian denominations', '270'),
('271', 'Religious congregations and orders in church history', '270'),
('272', 'Persecutions in church history', '270'),
('273', 'Doctrinal controversies and heresies in church history', '270'),
('274', 'Christianity in Europe', '270'),
('275', 'Christianity in Asia', '270'),
('276', 'Christianity in Africa', '270'),
('277', 'Christianity in North America', '270'),
('278', 'Christianity in South America', '270'),
('279', 'Christianity in other areas', '270');

INSERT INTO dewey_category (code, name, division_code) VALUES
('280', 'Christian denominations and sects', '280'),
('281', 'Early church and Eastern churches', '280'),
('282', 'Roman Catholic Church', '280'),
('283', 'Anglican churches', '280'),
('284', 'Protestants of Continental origin', '280'),
('285', 'Presbyterian churches', '280'),
('286', 'Baptist churches', '280'),
('287', 'Methodist churches', '280'),
('289', 'Other Christian denominations', '280');

INSERT INTO dewey_category (code, name, division_code) VALUES
('290', 'Comparative religion and other religions', '290'),
('291', 'Comparative religion', '290'),
('292', 'Classical religion (Greek and Roman religion)', '290'),
('293', 'Germanic religion', '290'),
('294', 'Religions of Indic origin', '290'),
('295', 'Zoroastrianism (Mazdaism, Parseeism)', '290'),
('296', 'Judaism', '290'),
('297', 'Islam, Babism, Bahai Faith', '290'),
('299', 'Other religions', '290');

-- 300-399: Social sciences
INSERT INTO dewey_category (code, name, division_code) VALUES
('300', 'Social sciences', '300'),
('301', 'Sociology and anthropology', '300'),
('302', 'Social interaction', '300'),
('303', 'Social processes', '300'),
('304', 'Factors affecting social behavior', '300'),
('305', 'Social groups', '300'),
('306', 'Culture and institutions', '300'),
('307', 'Communities', '300');

INSERT INTO dewey_category (code, name, division_code) VALUES
('310', 'Collections of general statistics', '310'),
('314', 'General statistics of Europe', '310'),
('315', 'General statistics of Asia', '310'),
('316', 'General statistics of Africa', '310'),
('317', 'General statistics of North America', '310'),
('318', 'General statistics of South America', '310'),
('319', 'General statistics of other areas', '310');

INSERT INTO dewey_category (code, name, division_code) VALUES
('320', 'Political science', '320'),
('321', 'Systems of governments and states', '320'),
('322', 'Relation of state to organized groups', '320'),
('323', 'Civil and political rights', '320'),
('324', 'The political process', '320'),
('325', 'International migration and colonization', '320'),
('326', 'Slavery and emancipation', '320'),
('327', 'International relations', '320'),
('328', 'The legislative process', '320'),
('329', 'Practical politics', '320');

INSERT INTO dewey_category (code, name, division_code) VALUES
('330', 'Economics', '330'),
('331', 'Labor economics', '330'),
('332', 'Financial economics', '330'),
('333', 'Economics of land and energy', '330'),
('334', 'Cooperatives', '330'),
('335', 'Socialism and related systems', '330'),
('336', 'Public finance', '330'),
('337', 'International economics', '330'),
('338', 'Production', '330'),
('339', 'Macroeconomics and related topics', '330');

INSERT INTO dewey_category (code, name, division_code) VALUES
('340', 'Law', '340'),
('341', 'Law of nations', '340'),
('342', 'Constitutional and administrative law', '340'),
('343', 'Military, defense, public property, public finance law', '340'),
('344', 'Labor, social service, education, cultural law', '340'),
('345', 'Criminal law', '340'),
('346', 'Private law', '340'),
('347', 'Procedure and courts', '340'),
('348', 'Laws, regulations, cases', '340'),
('349', 'Law of specific jurisdictions and areas', '340');

INSERT INTO dewey_category (code, name, division_code) VALUES
('350', 'Public administration and military science', '350'),
('351', 'Public administration', '350'),
('352', 'General considerations of public administration', '350'),
('353', 'Specific fields of public administration', '350'),
('354', 'Administration of economy and environment', '350'),
('355', 'Military science', '350'),
('356', 'Infantry forces and warfare', '350'),
('357', 'Mounted forces and warfare', '350'),
('358', 'Air and other specialized forces and warfare', '350'),
('359', 'Sea (Naval) forces and warfare', '350');

INSERT INTO dewey_category (code, name, division_code) VALUES
('360', 'Social problems and services, associations', '360'),
('361', 'Social problems and social welfare in general', '360'),
('362', 'Social welfare problems and services', '360'),
('363', 'Other social problems and services', '360'),
('364', 'Criminology', '360'),
('365', 'Penal and related institutions', '360'),
('366', 'Associations', '360'),
('367', 'General clubs', '360'),
('368', 'Insurance', '360'),
('369', 'Miscellaneous kinds of associations', '360');

INSERT INTO dewey_category (code, name, division_code) VALUES
('370', 'Education', '370'),
('371', 'Schools and their activities, special education', '370'),
('372', 'Primary education (Elementary education)', '370'),
('373', 'Secondary education', '370'),
('374', 'Adult education', '370'),
('375', 'Curricula', '370'),
('376', 'Education of women', '370'),
('377', 'Schools and religion', '370'),
('378', 'Higher education (Tertiary education)', '370'),
('379', 'Public policy issues in education', '370');

INSERT INTO dewey_category (code, name, division_code) VALUES
('380', 'Commerce, communications and transportation', '380'),
('381', 'Commerce (Trade)', '380'),
('382', 'International commerce (Foreign trade)', '380'),
('383', 'Postal communication', '380'),
('384', 'Communications, telecommunication', '380'),
('385', 'Railroad transportation', '380'),
('386', 'Inland waterway and ferry transportation', '380'),
('387', 'Water, air, space transportation', '380'),
('388', 'Transportation, ground transportation', '380'),
('389', 'Metrology and standardization', '380');

INSERT INTO dewey_category (code, name, division_code) VALUES
('390', 'Customs, etiquette and folklore', '390'),
('391', 'Costume and personal appearance', '390'),
('392', 'Customs of life cycle and domestic life', '390'),
('393', 'Death customs', '390'),
('394', 'General customs', '390'),
('395', 'Etiquette (Manners)', '390'),
('398', 'Folklore', '390'),
('399', 'Customs of war and diplomacy', '390');

-- 400-499: Language
INSERT INTO dewey_category (code, name, division_code) VALUES
('400', 'Language', '400'),
('401', 'Philosophy and theory of language', '400'),
('402', 'Miscellany of language', '400'),
('403', 'Dictionaries of language', '400'),
('404', 'Special topics of language', '400'),
('405', 'Serial publications of language', '400'),
('406', 'Organizations of language', '400'),
('407', 'Education, research, related topics of language', '400'),
('408', 'With respect to groups of people', '400'),
('409', 'Geographic and persons treatment of language', '400');

INSERT INTO dewey_category (code, name, division_code) VALUES
('410', 'Linguistics', '410'),
('411', 'Writing systems', '410'),
('412', 'Etymology', '410'),
('413', 'Dictionaries', '410'),
('414', 'Phonology and phonetics', '410'),
('415', 'Grammar', '410'),
('417', 'Dialectology and historical linguistics', '410'),
('418', 'Standard usage, applied linguistics', '410'),
('419', 'Sign languages', '410');

INSERT INTO dewey_category (code, name, division_code) VALUES
('420', 'English and Old English', '420'),
('421', 'English writing system and phonology', '420'),
('422', 'English etymology', '420'),
('423', 'English dictionaries', '420'),
('424', 'Not assigned or no longer used', '420'),
('425', 'English grammar', '420'),
('427', 'English language variations', '420'),
('428', 'Standard English usage', '420'),
('429', 'Old English (Anglo-Saxon)', '420');

INSERT INTO dewey_category (code, name, division_code) VALUES
('430', 'Germanic languages, German', '430'),
('431', 'German writing systems and phonology', '430'),
('432', 'German etymology', '430'),
('433', 'German dictionaries', '430'),
('434', 'Not assigned or no longer used', '430'),
('435', 'German grammar', '430'),
('437', 'German language variations', '430'),
('438', 'Standard German usage', '430'),
('439', 'Other Germanic languages', '430');

INSERT INTO dewey_category (code, name, division_code) VALUES
('440', 'Romance languages, French', '440'),
('441', 'French writing systems and phonology', '440'),
('442', 'French etymology', '440'),
('443', 'French dictionaries', '440'),
('445', 'French grammar', '440'),
('446', 'Not assigned or no longer used', '440'),
('447', 'French language variations', '440'),
('448', 'Standard French usage', '440'),
('449', 'Provençal and Catalan', '440');

INSERT INTO dewey_category (code, name, division_code) VALUES
('450', 'Italian, Romanian and Rhaeto-Romanic', '450'),
('451', 'Italian writing systems and phonology', '450'),
('452', 'Italian etymology', '450'),
('453', 'Italian dictionaries', '450'),
('454', 'Not assigned or no longer used', '450'),
('455', 'Italian grammar', '450'),
('457', 'Italian language variations', '450'),
('458', 'Standard Italian usage', '450'),
('459', 'Romanian and Rhaeto-Romanic', '450');

INSERT INTO dewey_category (code, name, division_code) VALUES
('460', 'Spanish and Portuguese languages', '460'),
('461', 'Spanish writing systems and phonology', '460'),
('462', 'Spanish etymology', '460'),
('463', 'Spanish dictionaries', '460'),
('465', 'Spanish grammar', '460'),
('467', 'Spanish language variations', '460'),
('468', 'Standard Spanish usage', '460'),
('469', 'Portuguese', '460');

INSERT INTO dewey_category (code, name, division_code) VALUES
('470', 'Latin and other Italic languages', '470'),
('471', 'Classical Latin writing and phonology', '470'),
('472', 'Classical Latin etymology', '470'),
('473', 'Classical Latin dictionaries', '470'),
('475', 'Classical Latin grammar', '470'),
('477', 'Old, postclassical, Vulgar Latin', '470'),
('478', 'Classical Latin usage', '470'),
('479', 'Other Italic languages', '470');

INSERT INTO dewey_category (code, name, division_code) VALUES
('480', 'Hellenic languages, Classical Greek', '480'),
('481', 'Classical Greek writing and phonology', '480'),
('482', 'Classical Greek etymology', '480'),
('483', 'Classical Greek dictionaries', '480'),
('485', 'Classical Greek grammar', '480'),
('487', 'Pre-Classical and post-Classical Greek', '480'),
('488', 'Classical Greek usage', '480'),
('489', 'Other Hellenic languages', '480');

INSERT INTO dewey_category (code, name, division_code) VALUES
('490', 'Other languages', '490'),
('491', 'East Indo-European and Celtic languages', '490'),
('492', 'Afro-Asiatic languages, Semitic languages', '490'),
('493', 'Non-Semitic Afro-Asiatic languages', '490'),
('494', 'Altaic, Uralic, Hyperborean, Dravidian', '490'),
('495', 'Languages of East and Southeast Asia', '490'),
('496', 'African languages', '490'),
('497', 'North American native languages', '490'),
('498', 'South American native languages', '490'),
('499', 'Austronesian and other languages', '490');

-- 500-599: Pure sciences
INSERT INTO dewey_category (code, name, division_code) VALUES
('500', 'Pure sciences', '500'),
('501', 'Philosophy and theory of sciences', '500'),
('502', 'Miscellany of sciences', '500'),
('503', 'Dictionaries of sciences', '500'),
('505', 'Serial publications of sciences', '500'),
('506', 'Organizations of sciences', '500'),
('507', 'Education, research, related topics of sciences', '500'),
('508', 'Natural history', '500'),
('509', 'Historical treatment of sciences', '500');

INSERT INTO dewey_category (code, name, division_code) VALUES
('510', 'Mathematics', '510'),
('511', 'General principles of mathematics', '510'),
('512', 'Algebra', '510'),
('513', 'Arithmetic', '510'),
('514', 'Topology', '510'),
('515', 'Analysis', '510'),
('516', 'Geometry', '510'),
('518', 'Numerical analysis', '510'),
('519', 'Probabilities and applied mathematics', '510');

INSERT INTO dewey_category (code, name, division_code) VALUES
('520', 'Astronomy and allied sciences', '520'),
('521', 'Celestial mechanics', '520'),
('522', 'Techniques, procedures, apparatus, equipment', '520'),
('523', 'Specific celestial bodies and phenomena', '520'),
('525', 'Earth (Astronomical geography)', '520'),
('526', 'Mathematical geography', '520'),
('527', 'Celestial navigation', '520'),
('528', 'Ephemerides', '520'),
('529', 'Chronology', '520');

INSERT INTO dewey_category (code, name, division_code) VALUES
('530', 'Physics', '530'),
('531', 'Classical mechanics, solid mechanics', '530'),
('532', 'Fluid mechanics, liquid mechanics', '530'),
('533', 'Pneumatics (Gas mechanics)', '530'),
('534', 'Sound and related vibrations', '530'),
('535', 'Light and related electromagnetic phenomena', '530'),
('536', 'Heat', '530'),
('537', 'Electricity and electronics', '530'),
('538', 'Magnetism', '530'),
('539', 'Modern physics', '530');

INSERT INTO dewey_category (code, name, division_code) VALUES
('540', 'Chemistry and allied sciences', '540'),
('541', 'Physical chemistry', '540'),
('542', 'Techniques, procedures, apparatus, equipment', '540'),
('543', 'Analytical chemistry', '540'),
('546', 'Inorganic chemistry', '540'),
('547', 'Organic chemistry', '540'),
('548', 'Crystallography', '540'),
('549', 'Mineralogy', '540');

INSERT INTO dewey_category (code, name, division_code) VALUES
('550', 'Earth sciences', '550'),
('551', 'Geology, hydrology, meteorology', '550'),
('552', 'Petrology', '550'),
('553', 'Economic geology', '550'),
('554', 'Earth sciences of Europe', '550'),
('555', 'Earth sciences of Asia', '550'),
('556', 'Earth sciences of Africa', '550'),
('557', 'Earth sciences of North America', '550'),
('558', 'Earth sciences of South America', '550'),
('559', 'Earth sciences of other areas', '550');

INSERT INTO dewey_category (code, name, division_code) VALUES
('560', 'Paleontology, paleozoology', '560'),
('561', 'Paleobotany, fossil microorganisms', '560'),
('562', 'Fossil invertebrates', '560'),
('563', 'Fossil marine and seashore invertebrates', '560'),
('564', 'Fossil mollusks', '560'),
('565', 'Fossil arthropods', '560'),
('566', 'Fossil chordates', '560'),
('567', 'Fossil cold-blooded vertebrates', '560'),
('568', 'Fossil birds', '560'),
('569', 'Fossil mammals', '560');

INSERT INTO dewey_category (code, name, division_code) VALUES
('570', 'Life sciences, biology', '570'),
('571', 'Physiology and related subjects', '570'),
('572', 'Biochemistry', '570'),
('573', 'Specific physiological systems in animals', '570'),
('575', 'Specific parts of and physiological systems in plants', '570'),
('576', 'Genetics and evolution', '570'),
('577', 'Ecology', '570'),
('578', 'Natural history of organisms', '570'),
('579', 'Microorganisms, fungi, algae', '570');

INSERT INTO dewey_category (code, name, division_code) VALUES
('580', 'Plants (botany)', '580'),
('581', 'Specific topics in natural history of plants', '580'),
('582', 'Plants noted for specific vegetative characteristics and flowers', '580'),
('583', 'Magnoliopsida (Dicotyledons)', '580'),
('584', 'Liliopsida (Monocotyledons)', '580'),
('585', 'Gymnosperms, Coniferophyta (Conifers)', '580'),
('586', 'Seedless plants', '580'),
('587', 'Pteridophyta (Vascular cryptogams)', '580'),
('588', 'Bryophyta', '580'),
('589', 'Thallobionta and Prokaryotae', '580');

INSERT INTO dewey_category (code, name, division_code) VALUES
('590', 'Animals (zoology)', '590'),
('591', 'Specific topics in natural history of animals', '590'),
('592', 'Invertebrates', '590'),
('593', 'Marine and seashore invertebrates', '590'),
('594', 'Mollusca and Molluscoidea', '590'),
('595', 'Arthropoda (Arthropods)', '590'),
('596', 'Chordata (Chordates)', '590'),
('597', 'Cold-blooded vertebrates, Pisces (Fishes)', '590'),
('598', 'Aves (Birds)', '590'),
('599', 'Mammalia (Mammals)', '590');

-- 600-699: Technology (applied sciences)
INSERT INTO dewey_category (code, name, division_code) VALUES
('600', 'Technology (applied sciences)', '600'),
('601', 'Philosophy and theory of technology', '600'),
('602', 'Miscellany of technology', '600'),
('603', 'Dictionaries of technology', '600'),
('604', 'Special topics of technology', '600'),
('605', 'Serial publications of technology', '600'),
('606', 'Organizations of technology', '600'),
('607', 'Education, research, related topics of technology', '600'),
('608', 'Inventions and patents', '600'),
('609', 'Historical treatment of technology', '600');

INSERT INTO dewey_category (code, name, division_code) VALUES
('610', 'Medicine and health', '610'),
('611', 'Human anatomy, cytology, histology', '610'),
('612', 'Human physiology', '610'),
('613', 'Personal health and safety', '610'),
('614', 'Forensic medicine, incidence of disease', '610'),
('615', 'Pharmacology and therapeutics', '610'),
('616', 'Diseases', '610'),
('617', 'Surgery and related medical specialties', '610'),
('618', 'Gynecology, obstetrics, pediatrics, geriatrics', '610'),
('619', 'Experimental medicine', '610');

INSERT INTO dewey_category (code, name, division_code) VALUES
('620', 'Engineering and allied operations', '620'),
('621', 'Applied physics', '620'),
('622', 'Mining and related operations', '620'),
('623', 'Military and nautical engineering', '620'),
('624', 'Civil engineering', '620'),
('625', 'Engineering of railroads, roads', '620'),
('626', 'Not assigned or no longer used', '620'),
('627', 'Hydraulic engineering', '620'),
('628', 'Sanitary and municipal engineering', '620'),
('629', 'Other branches of engineering', '620');

INSERT INTO dewey_category (code, name, division_code) VALUES
('630', 'Agriculture and related technologies', '630'),
('631', 'Techniques, equipment, materials', '630'),
('632', 'Plant injuries, diseases, pests', '630'),
('633', 'Field and plantation crops', '630'),
('634', 'Orchards, fruits, forestry', '630'),
('635', 'Garden crops (Horticulture)', '630'),
('636', 'Animal husbandry', '630'),
('637', 'Processing dairy and related products', '630'),
('638', 'Insect culture', '630'),
('639', 'Hunting, fishing, conservation, related technologies', '630');

INSERT INTO dewey_category (code, name, division_code) VALUES
('640', 'Home economics and family living', '640'),
('641', 'Food and drink', '640'),
('642', 'Meals and table service', '640'),
('643', 'Housing and household equipment', '640'),
('644', 'Household utilities', '640'),
('645', 'Household furnishing', '640'),
('646', 'Sewing, clothing, management of personal and family living', '640'),
('647', 'Management of public households', '640'),
('648', 'Housekeeping', '640'),
('649', 'Child rearing, home care of persons', '640');

INSERT INTO dewey_category (code, name, division_code) VALUES
('650', 'Management and auxiliary services', '650'),
('651', 'Office services', '650'),
('652', 'Processes of written communication', '650'),
('653', 'Shorthand', '650'),
('657', 'Accounting', '650'),
('658', 'General management', '650'),
('659', 'Advertising and public relations', '650');

INSERT INTO dewey_category (code, name, division_code) VALUES
('660', 'Chemical engineering and related technologies', '660'),
('661', 'Industrial chemicals', '660'),
('662', 'Explosives, fuels and related products', '660'),
('663', 'Beverage technology', '660'),
('664', 'Food technology', '660'),
('665', 'Industrial oils, fats, waxes, gases', '660'),
('666', 'Ceramic and allied technologies', '660'),
('667', 'Cleaning, color, coating, related technologies', '660'),
('668', 'Technology of other organic products', '660'),
('669', 'Metallurgy', '660');

INSERT INTO dewey_category (code, name, division_code) VALUES
('670', 'Manufacturing', '670'),
('671', 'Metalworking processes and primary metal products', '670'),
('672', 'Iron, steel, and other iron alloys', '670'),
('673', 'Nonferrous metals', '670'),
('674', 'Lumber processing, wood products, cork', '670'),
('675', 'Leather and fur processing', '670'),
('676', 'Pulp and paper technology', '670'),
('677', 'Textiles', '670'),
('678', 'Elastomers and elastomer products', '670'),
('679', 'Other products of specific kinds of materials', '670');

INSERT INTO dewey_category (code, name, division_code) VALUES
('680', 'Manufacture of products for specific uses', '680'),
('681', 'Precision instruments and other devices', '680'),
('682', 'Small forge work (Blacksmithing)', '680'),
('683', 'Hardware and household appliances', '680'),
('684', 'Furnishings and home workshops', '680'),
('685', 'Leather and fur goods, and related products', '680'),
('686', 'Printing and related activities', '680'),
('687', 'Clothing and accessories', '680'),
('688', 'Other final products, and packaging technology', '680'),
('689', 'Not assigned or no longer used', '680');

INSERT INTO dewey_category (code, name, division_code) VALUES
('690', 'Buildings and construction', '690'),
('691', 'Building materials', '690'),
('692', 'Auxiliary construction practices', '690'),
('693', 'Construction in specific materials and for specific purposes', '690'),
('694', 'Wood construction, Carpentry', '690'),
('695', 'Roof covering', '690'),
('696', 'Utilities', '690'),
('697', 'Heating, ventilating, air-conditioning engineering', '690'),
('698', 'Detail finishing', '690');

-- 700-799: Arts, recreation and sports
INSERT INTO dewey_category (code, name, division_code) VALUES
('700', 'Arts, recreation and sports', '700'),
('701', 'Philosophy and theory of fine and decorative arts', '700'),
('702', 'Miscellany of fine and decorative arts', '700'),
('703', 'Dictionaries of fine and decorative arts', '700'),
('704', 'Special topics of fine and decorative arts', '700'),
('705', 'Serial publications of fine and decorative arts', '700'),
('706', 'Organizations and management of fine and decorative arts', '700'),
('707', 'Education, research, related topics of fine and decorative arts', '700'),
('708', 'Galleries, museums, private collections of fine and decorative arts', '700'),
('709', 'Historical treatment of fine and decorative arts', '700');

INSERT INTO dewey_category (code, name, division_code) VALUES
('710', 'Civic and landscape art', '710'),
('711', 'Area planning', '710'),
('712', 'Landscape architecture', '710'),
('713', 'Landscape architecture of trafficways', '710'),
('714', 'Water features in landscape architecture', '710'),
('715', 'Woody plants in landscape architecture', '710'),
('716', 'Herbaceous plants in landscape architecture', '710'),
('717', 'Structures in landscape architecture', '710'),
('718', 'Landscape architecture of cemeteries', '710'),
('719', 'Natural landscapes', '710');

INSERT INTO dewey_category (code, name, division_code) VALUES
('720', 'Architecture', '720'),
('721', 'Architectural materials and structural elements', '720'),
('722', 'Architecture to ca. 300', '720'),
('723', 'Architecture from ca. 300 to 1399', '720'),
('724', 'Architecture from 1400', '720'),
('725', 'Public structures', '720'),
('726', 'Buildings for religious and related purposes', '720'),
('727', 'Buildings for education and research', '720'),
('728', 'Residential buildings', '720'),
('729', 'Design and decoration of structures and accessories', '720');

INSERT INTO dewey_category (code, name, division_code) VALUES
('730', 'Sculpture and related arts', '730'),
('731', 'Processes, forms, subjects of sculpture', '730'),
('732', 'Sculpture to ca. 500', '730'),
('733', 'Greek, Etruscan, Roman sculpture', '730'),
('734', 'Sculpture from ca. 500 to 1399', '730'),
('735', 'Sculpture from 1400', '730'),
('736', 'Carving and carvings', '730'),
('737', 'Numismatics and sigillography', '730'),
('738', 'Ceramic arts', '730'),
('739', 'Art metalwork', '730');

INSERT INTO dewey_category (code, name, division_code) VALUES
('740', 'Drawing and decorative arts', '740'),
('741', 'Drawing and drawings', '740'),
('742', 'Perspective in drawing', '740'),
('743', 'Drawing and drawings by subject', '740'),
('744', 'Not assigned or no longer used', '740'),
('745', 'Decorative arts', '740'),
('746', 'Textile arts', '740'),
('747', 'Interior decoration', '740'),
('748', 'Glass', '740'),
('749', 'Furniture and accessories', '740');

INSERT INTO dewey_category (code, name, division_code) VALUES
('750', 'Painting and paintings', '750'),
('751', 'Techniques, procedures, apparatus, equipment, materials, forms', '750'),
('752', 'Color', '750'),
('753', 'Symbolism, allegory, mythology, legend', '750'),
('754', 'Genre paintings', '750'),
('755', 'Religion', '750'),
('756', 'Not assigned or no longer used', '750'),
('757', 'Human figures', '750'),
('758', 'Nature, architectural subjects and cityscapes', '750'),
('759', 'Historical treatment of painting and paintings', '750');

INSERT INTO dewey_category (code, name, division_code) VALUES
('760', 'Graphic arts, printmaking and prints', '760'),
('761', 'Relief processes (Block printing)', '760'),
('763', 'Lithographic (Planographic) processes', '760'),
('764', 'Chromolithography and serigraphy', '760'),
('765', 'Metal engraving', '760'),
('766', 'Mezzotinting and related processes', '760'),
('767', 'Etching and drypoint', '760'),
('769', 'Prints', '760');

INSERT INTO dewey_category (code, name, division_code) VALUES
('770', 'Photography, digital imaging and computer art', '770'),
('771', 'Techniques, procedures, apparatus, equipment, materials', '770'),
('772', 'Metallic salt processes', '770'),
('773', 'Pigment processes of printing', '770'),
('774', 'Holography', '770'),
('775', 'Digital photography', '770'),
('776', 'Computer art (Digital art)', '770'),
('778', 'Fields and kinds of photography', '770'),
('779', 'Photographs', '770');

INSERT INTO dewey_category (code, name, division_code) VALUES
('780', 'Music', '780'),
('781', 'General principles and musical forms', '780'),
('782', 'Vocal music', '780'),
('783', 'Music for single voices, the voice', '780'),
('784', 'Instruments and instrumental ensembles and their music', '780'),
('785', 'Ensembles and their music', '780'),
('786', 'Keyboard and other instruments', '780'),
('787', 'Stringed instruments', '780'),
('788', 'Wind instruments', '780');

INSERT INTO dewey_category (code, name, division_code) VALUES
('790', 'Recreational and performing arts', '790'),
('791', 'Public performances', '790'),
('792', 'Stage presentations', '790'),
('793', 'Indoor games and amusements', '790'),
('794', 'Indoor games of skill', '790'),
('795', 'Games of chance', '790'),
('796', 'Athletic and outdoor sports and games', '790'),
('797', 'Aquatic and air sports', '790'),
('798', 'Equestrian sports and animal racing', '790'),
('799', 'Fishing, hunting, shooting', '790');

-- 800-899: Literature
INSERT INTO dewey_category (code, name, division_code) VALUES
('800', 'Literature', '800'),
('801', 'Philosophy and theory of literature', '800'),
('802', 'Miscellany of literature', '800'),
('803', 'Dictionaries of literature', '800'),
('804', 'Special topics of literature', '800'),
('805', 'Serial publications of literature', '800'),
('806', 'Organizations and management of literature', '800'),
('807', 'Education, research, related topics of literature', '800'),
('808', 'Rhetoric and collections of literary texts from more than two literatures', '800'),
('809', 'History, description, critical appraisal of more than two literatures', '800');

INSERT INTO dewey_category (code, name, division_code) VALUES
('810', 'American literature in English', '810'),
('811', 'American poetry in English', '810'),
('812', 'American drama in English', '810'),
('813', 'American fiction in English', '810'),
('814', 'American essays in English', '810'),
('815', 'American speeches in English', '810'),
('816', 'American letters in English', '810'),
('817', 'American humor and satire in English', '810'),
('818', 'American miscellaneous writings in English', '810'),
('819', 'Literatures of other languages of North America', '810');

INSERT INTO dewey_category (code, name, division_code) VALUES
('820', 'English and Old English literatures', '820'),
('821', 'English poetry', '820'),
('822', 'English drama', '820'),
('823', 'English fiction', '820'),
('824', 'English essays', '820'),
('825', 'English speeches', '820'),
('826', 'English letters', '820'),
('827', 'English humor and satire', '820'),
('828', 'English miscellaneous writings', '820'),
('829', 'Old English (Anglo-Saxon)', '820');

INSERT INTO dewey_category (code, name, division_code) VALUES
('830', 'Literatures of Germanic languages', '830'),
('831', 'German poetry', '830'),
('832', 'German drama', '830'),
('833', 'German fiction', '830'),
('834', 'German essays', '830'),
('835', 'German speeches', '830'),
('836', 'German letters', '830'),
('837', 'German humor and satire', '830'),
('838', 'German miscellaneous writings', '830'),
('839', 'Other Germanic literatures', '830');

INSERT INTO dewey_category (code, name, division_code) VALUES
('840', 'Literatures of Romance languages, French literature', '840'),
('841', 'French poetry', '840'),
('842', 'French drama', '840'),
('843', 'French fiction', '840'),
('844', 'French essays', '840'),
('845', 'French speeches', '840'),
('846', 'French letters', '840'),
('847', 'French humor and satire', '840'),
('848', 'French miscellaneous writings', '840'),
('849', 'Occitan and Catalan literatures', '840');

INSERT INTO dewey_category (code, name, division_code) VALUES
('850', 'Italian, Romanian and Rhaeto-Romanic literatures', '850'),
('851', 'Italian poetry', '850'),
('852', 'Italian drama', '850'),
('853', 'Italian fiction', '850'),
('854', 'Italian essays', '850'),
('855', 'Italian speeches', '850'),
('856', 'Italian letters', '850'),
('857', 'Italian humor and satire', '850'),
('858', 'Italian miscellaneous writings', '850'),
('859', 'Romanian and Rhaeto-Romanic literatures', '850');

INSERT INTO dewey_category (code, name, division_code) VALUES
('860', 'Spanish and Portuguese literatures', '860'),
('861', 'Spanish poetry', '860'),
('862', 'Spanish drama', '860'),
('863', 'Spanish fiction', '860'),
('864', 'Spanish essays', '860'),
('865', 'Spanish speeches', '860'),
('866', 'Spanish letters', '860'),
('867', 'Spanish humor and satire', '860'),
('868', 'Spanish miscellaneous writings', '860'),
('869', 'Portuguese literature', '860');

INSERT INTO dewey_category (code, name, division_code) VALUES
('870', 'Latin and other Italic literatures', '870'),
('871', 'Latin poetry', '870'),
('872', 'Latin dramatic poetry and drama', '870'),
('873', 'Latin epic poetry and fiction', '870'),
('874', 'Latin lyric poetry', '870'),
('875', 'Latin speeches', '870'),
('876', 'Latin letters', '870'),
('877', 'Latin humor and satire', '870'),
('878', 'Latin miscellaneous writings', '870'),
('879', 'Other Italic literatures', '870');

INSERT INTO dewey_category (code, name, division_code) VALUES
('880', 'Hellenic literatures, Classical Greek', '880'),
('881', 'Classical Greek poetry', '880'),
('882', 'Classical Greek dramatic poetry and drama', '880'),
('883', 'Classical Greek epic poetry and fiction', '880'),
('884', 'Classical Greek lyric poetry', '880'),
('885', 'Classical Greek speeches', '880'),
('886', 'Classical Greek letters', '880'),
('887', 'Classical Greek humor and satire', '880'),
('888', 'Classical Greek miscellaneous writings', '880'),
('889', 'Modern Greek literature', '880');

INSERT INTO dewey_category (code, name, division_code) VALUES
('890', 'Literatures of other languages', '890'),
('891', 'East Indo-European and Celtic literatures', '890'),
('892', 'Afro-Asiatic literatures, Semitic literatures', '890'),
('893', 'Non-Semitic Afro-Asiatic literatures', '890'),
('894', 'Altaic, Uralic, Hyperborean, Dravidian literatures', '890'),
('895', 'Literatures of East and Southeast Asia', '890'),
('896', 'African literatures', '890'),
('897', 'North American native literatures', '890'),
('898', 'South American native literatures', '890'),
('899', 'Austronesian and other literatures', '890');

-- 900-999: History and geography
INSERT INTO dewey_category (code, name, division_code) VALUES
('900', 'History and geography', '900'),
('901', 'Philosophy and theory of history', '900'),
('902', 'Miscellany of history', '900'),
('903', 'Dictionaries of history', '900'),
('904', 'Collected accounts of events', '900'),
('905', 'Serial publications of history', '900'),
('906', 'Organizations and management of history', '900'),
('907', 'Education, research, related topics of history', '900'),
('908', 'With respect to groups of people', '900'),
('909', 'World history', '900');

INSERT INTO dewey_category (code, name, division_code) VALUES
('910', 'Geography and travel', '910'),
('911', 'Historical geography', '910'),
('912', 'Graphic representations of surface of earth and of extraterrestrial worlds', '910'),
('913', 'Geography of and travel in ancient world', '910'),
('914', 'Geography of and travel in Europe', '910'),
('915', 'Geography of and travel in Asia', '910'),
('916', 'Geography of and travel in Africa', '910'),
('917', 'Geography of and travel in North America', '910'),
('918', 'Geography of and travel in South America', '910'),
('919', 'Geography of and travel in other areas', '910');

INSERT INTO dewey_category (code, name, division_code) VALUES
('920', 'Biography, genealogy and insignia', '920'),
('929', 'Genealogy, names, insignia', '920');

INSERT INTO dewey_category (code, name, division_code) VALUES
('930', 'History of ancient world to ca. 499', '930'),
('931', 'China to 420', '930'),
('932', 'Egypt to 640', '930'),
('933', 'Palestine to 70', '930'),
('934', 'India to 647', '930'),
('935', 'Mesopotamia and Iranian Plateau to 637', '930'),
('936', 'Europe north and west of Italian Peninsula to ca. 499', '930'),
('937', 'Italian Peninsula and adjacent territories to 476 and 1453', '930'),
('938', 'Greece to 323', '930'),
('939', 'Other parts of ancient world to ca. 640', '930');

INSERT INTO dewey_category (code, name, division_code) VALUES
('940', 'General history of Europe', '940'),
('941', 'British Isles', '940'),
('942', 'England and Wales', '940'),
('943', 'Central Europe, Germany', '940'),
('944', 'France and Monaco', '940'),
('945', 'Italian Peninsula and adjacent islands', '940'),
('946', 'Iberian Peninsula and adjacent islands', '940'),
('947', 'Eastern Europe, Russia', '940'),
('948', 'Scandinavia', '940'),
('949', 'Other parts of Europe', '940');

INSERT INTO dewey_category (code, name, division_code) VALUES
('950', 'General history of Asia', '950'),
('951', 'China and adjacent areas', '950'),
('952', 'Japan', '950'),
('953', 'Arabian Peninsula and adjacent areas', '950'),
('954', 'South Asia, India', '950'),
('955', 'Iran', '950'),
('956', 'Middle East (Near East)', '950'),
('957', 'Siberia (Asiatic Russia)', '950'),
('958', 'Central Asia', '950'),
('959', 'Southeast Asia', '950');

INSERT INTO dewey_category (code, name, division_code) VALUES
('960', 'General history of Africa', '960'),
('961', 'Tunisia and Libya', '960'),
('962', 'Egypt and Sudan', '960'),
('963', 'Ethiopia and Eritrea', '960'),
('964', 'Morocco and Canary Islands', '960'),
('965', 'Algeria', '960'),
('966', 'West Africa and offshore islands', '960'),
('967', 'Central Africa and offshore islands', '960'),
('968', 'Southern Africa', '960'),
('969', 'South Indian Ocean islands', '960');

INSERT INTO dewey_category (code, name, division_code) VALUES
('970', 'General history of North America', '970'),
('971', 'Canada', '970'),
('972', 'Mexico, Central America, Caribbean islands', '970'),
('973', 'United States', '970'),
('974', 'Northeastern United States', '970'),
('975', 'Southeastern United States', '970'),
('976', 'South central United States', '970'),
('977', 'North central United States', '970'),
('978', 'Western United States', '970'),
('979', 'Great Basin and Pacific Slope region of United States', '970');

INSERT INTO dewey_category (code, name, division_code) VALUES
('980', 'General history of South America', '980'),
('981', 'Brazil', '980'),
('982', 'Argentina', '980'),
('983', 'Chile', '980'),
('984', 'Bolivia', '980'),
('985', 'Peru', '980'),
('986', 'Colombia and Ecuador', '980'),
('987', 'Venezuela', '980'),
('988', 'Guyana', '980'),
('989', 'Paraguay and Uruguay', '980');

INSERT INTO dewey_category (code, name, division_code) VALUES
('990', 'General history of other areas', '990'),
('993', 'New Zealand', '990'),
('994', 'Australia', '990'),
('995', 'Melanesia, New Guinea', '990'),
('996', 'Other parts of Pacific, Polynesia', '990'),
('997', 'Atlantic Ocean islands', '990'),
('998', 'Arctic islands and Antarctica', '990'),
('999', 'Extraterrestrial worlds', '990');






