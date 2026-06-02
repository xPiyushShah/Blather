
        /**image preview script */
        var loadFile = function(event, id) {
            if (photoFileValidation(id)) {
                var reader = new FileReader();
                reader.onload = function() {
                    var output = document.getElementById(id);
                    output.src = reader.result;
                };
                reader.readAsDataURL(event.target.files[0]);
            }
        };

                        
        
        
        
        function openANM(ANMValue)
        {
            if(ANMValue == '1')
            {
                $("#tableANM").removeClass('d-none');
                $("#anm_subjects").prop('required', true);
                $("#anm_state").prop('required', true);
                $("#anm_institution").prop('required', true);
                $("#anm_year").prop('required', true);
                $("#anm_max_marks").prop('required', true);
                $("#anm_obtained_marks").prop('required', true);
                $("#anm_percentage_marks").prop('required', true);
                $("#is_reg_anm").prop('required', true);
                //$("#anm_up_reg_no").prop('required', true);
                //$("#anm_regno_state").prop('required', true);
            }
            else
            {
                $("#anm_subjects").prop('required', false);
                $("#anm_state").prop('required', false);
                $("#anm_institution").prop('required', false);
                $("#anm_year").prop('required', false);
                $("#anm_max_marks").prop('required', false);
                $("#anm_obtained_marks").prop('required', false);
                $("#anm_percentage_marks").prop('required', false);
                $("#tableANM").addClass('d-none');
                // $("#vocANMBlock").removeClass('d-none');
                $("#vocANMBlock").addClass('d-none');
                $("#is_reg_anm").prop('required', false);
                //$("#anm_up_reg_no").prop('required', false);
                //$("#anm_regno_state").prop('required', false);
                // ✅ Clear values
                openRegisteredANM('0');

                $("#is_reg_anm").val('0');
                $("#anm_state").val('');
                $("#anm_institution").val('');
                $("#anm_year").val('');
                $("#anm_max_marks").val('');
                $("#anm_obtained_marks").val('');
                $("#anm_percentage_marks").val('');
                $("#anm_subjects").val('');
            }
        }

        function openRegisteredANM(ANMValue)
        {
            if(ANMValue == '1')
            {
                $("#tableRegisteredANM").removeClass('d-none');
                $("#anm_up_reg_no").prop('required', true);
                $("#anm_regno_state").prop('required', true);
            }
            else
            {
                $("#tableRegisteredANM").addClass('d-none');
                $("#anm_up_reg_no").prop('required', false);
                $("#anm_regno_state").prop('required', false);
                // ✅ Clear values
                $("#anm_up_reg_no").val('');
                $("#anm_regno_state").val('');
            }
        }


        function selectCourseBySubject(subject) {
            $("#course").html('');
            if (subject == 'BIOLOGY') {
                $("#course").append(`<option value="" >-- Select Course --</option>
                                    <option value="1-Bachelors in Medical Laboratory Science (BMLS) 4 years">Bachelors in Medical Laboratory Science (BMLS) 4 years </option>
                                    <option value="2-Bachelor of Optometry (BOptom) 4 years" >Bachelor of Optometry (BOptom) 4 years </option>
                                    <option value="3-B.Sc. in Operation Theatre Technology (BOTT) 4 years" >B.Sc. in Operation Theatre Technology (BOTT) 4 years</option>
                                    <option value="4-B.Sc. in Medical Radiology & Imaging Technology (BMRIT) 4 years" >B.Sc. in Medical Radiology &amp; Imaging Technology (BMRIT) 4 years</option>
                                    <option value="5-Bachelor in Audiology and Speech Language Pathology (BASLP) 4 years" >Bachelor in Audiology and Speech Language Pathology (BASLP) 4 years</option>
                                    <option value="6-Bachelor of Physiotherapy (BPT) 4 ½ years" >Bachelor of Physiotherapy (BPT) 4 ½ years</option>
                                    <option value="7-Bachelor of Occupational Therapy (BOT) 4 ½ years" >Bachelor of Occupational Therapy (BOT) 4 ½ years</option>
                                    <option value="8-Bachelor of Medical Microbiology 4 years" >Bachelor of Medical Microbiology 4 years</option>
                                    <option value="9-B.Sc. Renal Dialysis Technology" >B.Sc. Renal Dialysis Technology</option>
                                    <option value="10 B.Sc. Radio-diagnosis & Imaging Technology">B.Sc. Radio-diagnosis & Imaging Technology</option>
                                    <option value="11-B.Sc. Radiotherapy Technology" >B.Sc. Radiotherapy Technology</option>
                                    <option value="12-B.Sc. Laboratory Technology" >B.Sc. Laboratory Technology</option>
                                    <option value="13-B.Sc. Perfusion Technology" >B.Sc. Perfusion Technology</option>
                                    <option value="14-Bachelor of Physiotherapy" >Bachelor of Physiotherapy</option>
                                    <option value="15-Bachelor of Science, MLT (Transfusion Medicine Technology)" >Bachelor of Science, MLT (Transfusion Medicine Technology)</option>
                                    <option value="16-B.Sc. Operation Theatre & Anesthesia Technology" >B.Sc. Operation Theatre & Anesthesia Technology</option>
                                    <option value="17-Bachelor of Science in Medical Laboratory Technology" >Bachelor of Science in Medical Laboratory Technology</option>
                                    <option value="18-Bachelor of Science in Radiological Imaging Techniques" >Bachelor of Science in Radiological Imaging Techniques</option>
                                    <option value="19-B.Sc. in Radiotherapy" >B.Sc. in Radiotherapy</option>
                                    `);
            } else if (subject == 'MATHEMATICS') {
                $("#course").append(`<option value="" >-- Select Course --</option>
                                    <option value="2-Bachelor of Optometry (BOptom) 4 years" >Bachelor of Optometry (BOptom) 4 years </option>
                                    <option value="5-Bachelor in Audiology and Speech Language Pathology (BASLP) 4 years" >Bachelor in Audiology and Speech Language Pathology (BASLP) 4 years</option>
                                    `);
            } else {
                $("#course").append(`<option value="" >-- Select Course --</option>
                                    <option value="5-Bachelor in Audiology and Speech Language Pathology (BASLP) 4 years" >Bachelor in Audiology and Speech Language Pathology (BASLP) 4 years</option>
                                    `);
            }
                    }

        

        function ParamedicalBechloreCourse(course) {
            let courseNo = course;
            $("#graduation_exam").html('');
            if (courseNo == '19') {
                $("#graduation_exam").append(
                    `<option value="" >-- Select Course --</option>
                                    <option value="Bachelor in Medical Laboratory Science (BMLS)"   >Bachelor in Medical Laboratory Science (BMLS)</option>`
                );
            } else if (courseNo == '20') {
                $("#graduation_exam").append(
                    `<option value="" >-- Select Course --</option>
                                    <option value="Bachelor of Optometry (BOptom)"   >Bachelor of Optometry (BOptom)</option>`
                );
            } else if (courseNo == '21') {
                $("#graduation_exam").append(
                    `<option value="" >-- Select Course --</option>
                                    <option value="B.Sc. in Operation Theatre Technology (BOTT)"   >B.Sc. in Operation Theatre Technology (BOTT)</option>
                                    <option value="B.Sc. Anaesthesia"   >B.Sc. Anaesthesia</option>`
                );
            } else if (courseNo == '22') {
                $("#graduation_exam").append(
                    `<option value="" >-- Select Course --</option>
                                    <option value="B.Sc. in Medical Radiology & Imaging Technology"   >B.Sc. in Medical Radiology & Imaging Technology</option>
                                    <option value="B.Sc. in Medical Technology Radio Diagnosis & Imaging"   >B.Sc. in Medical Technology Radio Diagnosis & Imaging</option>
                                    <option value="B.Sc. Radiology Technology"   >B.Sc. Radiology Technology</option>
                                    <option value="B.Sc. in Radiography"   >B.Sc. in Radiography</option>
                                    <option value="B.Sc. Medical Technology (X-ray)"   >B.Sc. Medical Technology (X-ray)</option>`
                );
            }
            //else if(courseNo == '5' || courseNo == '6')
            //{
            //    $("#graduation_exam").append(`<option value="" >-- Select Course --</option>
            //                      <option value="Bachelor in Audiology and Speech Language Pathology (BASLP)"   >Bachelor in Audiology and Speech Language Pathology (BASLP)</option>
            //                      <option value="B.Sc. (Speech & Hearing)"   >B.Sc. (Speech & Hearing)</option>`);
            //}
            else if (courseNo == '23') {
                $("#graduation_exam").append(
                    `<option value="" >-- Select Course --</option>
                                    <option value="Bachelor of Physiotherapy (BPT)"   >Bachelor of Physiotherapy (BPT)</option>`
                );
            } else if (courseNo == '24') {
                $("#graduation_exam").append(
                    `<option value="" >-- Select Course --</option>
                                    <option value="Bachelor of Occupational Therapy (BOT)"   >Bachelor of Occupational Therapy (BOT)</option>`
                );
            } else if (courseNo == '28') {
                $("#graduation_exam").append(
                    `<option value="" >-- Select Course --</option>
                                    <option value="Bachelor in Audiology and Speech Language Pathology"   >Bachelor in Audiology and Speech Language Pathology</option>`
                );
            }
        }


        function graduationDiplomaCheck(graduationName) {
                            if (graduationName == 'B.Sc.') {
                    $('#diploma').attr('required', true);
                    $('#diploma_institution').attr('required', true);
                    $('#diploma_year').attr('required', true);
                    $('#diploma_max_marks').attr('required', true);
                    $('#diploma_obtained_marks').attr('required', true);
                    $('#diploma_percentage_marks').attr('required', true);
                    $('#diploma_subjects').attr('required', true);
                    $('#dept_inst_off_exp').attr('required', true);
                    $('#from_exp').attr('required', true);
                    $('#to_exp').attr('required', true);
                } else {
                    $('#diploma').attr('required', false);
                    $('#diploma_institution').attr('required', false);
                    $('#diploma_year').attr('required', false);
                    $('#diploma_max_marks').attr('required', false);
                    $('#diploma_obtained_marks').attr('required', false);
                    $('#diploma_percentage_marks').attr('required', false);
                    $('#diploma_subjects').attr('required', false);
                    $('#dept_inst_off_exp').attr('required', false);
                    $('#from_exp').attr('required', false);
                    $('#to_exp').attr('required', false);
                }
            
        }

        function checkINCStatus() {
            let gnmINC = $('input[name="gnmINC"]:checked').val();
            if (gnmINC == '2') {
                $("#btn_PartThree").prop('disabled', true);
                swal("Error", 'You are not eligible for the Entrance Exam', 'error');
            } else {
                $("#btn_PartThree").prop('disabled', false);
            }
        }

        function checkSMCStatus() {
            let gnmSMC = $('input[name="gnmSMC"]:checked').val();
            if (gnmSMC == '2') {
                $("#btn_PartThree").prop('disabled', true);
                swal("Error", 'You are not eligible for the Entrance Exam', 'error');
            } else {
                $("#btn_PartThree").prop('disabled', false);
            }
        }

                // High School

        function checkMarksSmallerSci(ObtMarks) {
            let MaxMarks = $("#sci_mm").val();
            if (MaxMarks.length > 0 && Number(ObtMarks) > Number(MaxMarks)) {
                swal("Error", 'Obtained Marks cannot be greater then Max Marks ', 'error');
                $("#sci_om").val("");
            }
        }

        function checkMarksSmallerMaths(ObtMarks) {
            let MaxMarks = $("#maths_mm").val();
            if (MaxMarks.length > 0 && Number(ObtMarks) > Number(MaxMarks)) {
                swal("Error", 'Obtained Marks cannot be greater then Max Marks ', 'error');
                $("#maths_om").val("");
            }
        }

        function checkMarksSmallerSosci(ObtMarks) {
            let MaxMarks = $("#sosci_mm").val();
            if (MaxMarks.length > 0 && Number(ObtMarks) > Number(MaxMarks)) {
                swal("Error", 'Obtained Marks cannot be greater then Max Marks ', 'error');
                $("#sosci_om").val("");
            }
        }

        function checkMarksSmallerEng10(ObtMarks) {
            let MaxMarks = $("#eng10_mm").val();
            if (MaxMarks.length > 0 && Number(ObtMarks) > Number(MaxMarks)) {
                swal("Error", 'Obtained Marks cannot be greater then Max Marks ', 'error');
                $("#eng10_om").val("");
            }
        }

        function checkMarksSmallerHin(ObtMarks) {
            let MaxMarks = $("#hin_mm").val();
            if (MaxMarks.length > 0 && Number(ObtMarks) > Number(MaxMarks)) {
                swal("Error", 'Obtained Marks cannot be greater then Max Marks ', 'error');
                $("#hin_om").val("");
            }
        }

        //End High School

        function checkMarksSmallerBio(ObtMarks) {
            let MaxMarks = $("#bio_mm").val();
            if (MaxMarks.length > 0 && Number(ObtMarks) > Number(MaxMarks)) {
                swal("Error", 'Obtained Marks cannot be greater then Max Marks ', 'error');
                $("#bio_om").val("");
            }
        }

        function checkMarksSmallerPhy(ObtMarks) {
            let MaxMarks = $("#phy_mm").val();
            if (MaxMarks.length > 0 && Number(ObtMarks) > Number(MaxMarks)) {
                swal("Error", 'Obtained Marks cannot be greater then Max Marks ', 'error');
                $("#phy_om").val("");
            }
        }

        function checkMarksSmallerChe(ObtMarks) {
            let MaxMarks = $("#che_mm").val();
            if (MaxMarks.length > 0 && Number(ObtMarks) > Number(MaxMarks)) {
                swal("Error", 'Obtained Marks cannot be greater then Max Marks ', 'error');
                $("#che_om").val("");
            }
        }

        function checkMarksSmallerEng(ObtMarks) {
            let MaxMarks = $("#eng_mm").val();
            if (MaxMarks.length > 0 && Number(ObtMarks) > Number(MaxMarks)) {
                swal("Error", 'Obtained Marks cannot be greater then Max Marks ', 'error');
                $("#eng_om").val("");
            }
        }

        
                
        
        function gnmStateCheck(state) {
            if (state != 'UTTAR PRADESH') {
                $("#incBlock").removeClass('d-none');
                $('input[name="gnmINC"]').attr('required', true);
            } else {
                $("#incBlock").addClass('d-none');
                $('input[name="gnmINC"]').attr('required', false);

            }
        }
        
        
        function anmStateCheck(state) {
            if (state != 'UTTAR PRADESH') {
                $("#incBlock").removeClass('d-none');
                $('input[name="gnmINC"]').attr('required', true);
            } else {
                $("#incBlock").addClass('d-none');
                $('input[name="gnmINC"]').attr('required', false);

            }
        }

        function gnmSMCcheck(gnmcollege) {
            if (gnmcollege.length > 0) {
                $("#smcBlock").removeClass('d-none');
                $('input[name="gnmSMC"]').attr('required', true)
            } else {
                $("#smcBlock").addClass('d-none');
                $('input[name="gnmSMC"]').attr('required', false)
            }
        }
        function anmSMCcheck(anmcollege) {
            if (anmcollege.length > 0) {
                $("#smcBlock").removeClass('d-none');
                $('input[name="anmSMC"]').attr('required', true)
            } else {
                $("#smcBlock").addClass('d-none');
                $('input[name="anmSMC"]').attr('required', false)
            }
        }
                        function enableOthersField(className, boardValue) {
            if (className == '10') {
                if (boardValue == 'OTHER') {
                    $("#high_school_board_other").removeClass('d-none');
                    $("#high_school_board_other").prop('disabled', false);
                    $("#high_school_board_other").attr('required', true);
                } else {
                    $("#high_school_board_other").addClass('d-none');
                    $("#high_school_board_other").attr('required', false);
                    $("#high_school_board_other").prop('disabled', true);
                }
            } else if (className == '12') {
                if (boardValue == 'OTHER') {
                    $("#intermediate_board_other").removeClass('d-none');
                    $("#intermediate_board_other").prop('disabled', false);
                    $("#intermediate_board_other").attr('required', true);
                } else {
                    $("#intermediate_board_other").addClass('d-none');
                    $("#intermediate_board_other").attr('required', false);
                    $("#intermediate_board_other").prop('disabled', true);
                }
            }
        }

        
        
        
        
        
        function getDistrictPermanent(state) {
            $('#cover-spin').show(0);
            data = {
                "_token": "laq4xcSmINA6eRKQcnN5TmBDGUaVbjAPegfiyAHD",
                "state": state
            };
            $.ajax({
                url: "https://www.abvmucet26.co.in/api/state_district",
                method: "GET",
                data: data,
                success: function(response) {
                    //console.log(response);
                    $("#permanent_city").empty();
                    $('#permanent_city').append(new Option("-- SELECT CITY--", ""));
                    $.each(response.districts, function(index, value) {
                        $('#permanent_city').append(new Option(value.district, value.district));
                    });
                    var permanent_city = '';
                    if (permanent_city) {
                        $('#permanent_city').val(permanent_city);
                    }
                    $('#cover-spin').hide(0);
                },
                error: function(err) {
                    console.log(err);
                    $('#cover-spin').hide(0);
                }
            });
        }

        function getDistrictCorrespondence(state, same = 0) {
            $('#cover-spin').show(0);
            data = {
                "_token": "laq4xcSmINA6eRKQcnN5TmBDGUaVbjAPegfiyAHD",
                "state": state
            };
            $.ajax({
                url: "https://www.abvmucet26.co.in/api/state_district",
                method: "GET",
                data: data,
                success: function(response) {
                    //console.log(response);
                    $("#correspondence_city").empty();
                    $('#correspondence_city').append(new Option("-- SELECT CITY--", ""));
                    $.each(response.districts, function(index, value) {
                        $('#correspondence_city').append(new Option(value.district, value.district));
                    });
                    var correspondence_city = '';
                    if (correspondence_city) {
                        $('#correspondence_city').val(correspondence_city);
                    }
                    if (same == 1) {
                        $('#correspondence_city').val($("#permanent_city").val());
                    }
                    $('#cover-spin').hide(0);
                },
                error: function(err) {
                    console.log(err);
                    $('#cover-spin').hide(0);
                }
            });
        }

        function getDistrictBank(state) {
            $('#cover-spin').show(0);
            data = {
                "_token": "laq4xcSmINA6eRKQcnN5TmBDGUaVbjAPegfiyAHD",
                "state": state
            };
            $.ajax({
                url: "https://www.abvmucet26.co.in/api/state_district",
                method: "GET",
                data: data,
                success: function(response) {
                    //console.log(response);
                    $("#bank_dist").empty();
                    $('#bank_dist').append(new Option("-- SELECT CITY--", ""));
                    $.each(response.districts, function(index, value) {
                        $('#bank_dist').append(new Option(value.district, value.district));
                    });
                    var bank_dist = '';
                    if (bank_dist) {
                        $('#bank_dist').val(bank_dist);
                    }
                    $('#cover-spin').hide(0);
                },
                error: function(err) {
                    console.log(err);
                    $('#cover-spin').hide(0);
                }
            });
        }

        function getBoards() {
            $('#cover-spin').show(0);
            $.ajax({
                url: "https://www.abvmucet26.co.in/api/boards",
                method: "GET",
                success: function(response) {
                    //console.log(response);
                    $('#high_school_board').append(new Option("-- SELECT BOARD--", ""));
                    $('#intermediate_board').append(new Option("-- SELECT BOARD--", ""));
                    $.each(response.boards, function(index, value) {
                        $('#high_school_board').append(new Option(value.title, value.title));
                    });
                    var high_school_board = '';
                    if (high_school_board) {
                        $('#high_school_board').val(high_school_board);
                    }
                    $.each(response.boards, function(index, value) {
                        $('#intermediate_board').append(new Option(value.title, value.title));
                    });
                    var intermediate_board = '';
                    if (intermediate_board) {
                        $('#intermediate_board').val(intermediate_board);
                    }
                    $('#cover-spin').hide(0);
                },
                error: function(err) {
                    console.log(err);
                    $('#cover-spin').hide(0);
                }
            });
        }


        function checkYear(year, yearType) {
            //if(yearType == 'high_school_year')
            //{
            //if(year.length == 4 && (year == '2020' || year == '2021') && $("#promotedStatus").prop('checked') == true)
            //{
            //    $("#high_school_max_marks").attr('required',false);
            //    $("#high_school_obtained_marks").attr('required',false);
            //    $("#high_school_percentage_marks").attr('required',false);
            //}
            //else
            //{
            //    $("#high_school_max_marks").attr('required',true);
            //    $("#high_school_obtained_marks").attr('required',true);
            //    $("#high_school_percentage_marks").attr('required',true);
            //}
            //}
            var currentYear = "2026";
            if (yearType == 'high_school_year') {
                if (year.length == 4 && year > currentYear) {
                    swal('High School Year can not be in future year');
                    $("#high_school_year").val("");
                    return false;
                }
            }
            if (yearType == 'intermediate_year') {
                highSchoolYear = $("#high_school_year").val();
                if (year.length == 4 && year <= highSchoolYear) {
                    swal('Intermediate Year can not be before than High School Year');
                    $("#intermediate_year").val("");
                    return false;
                } else if (year.length == 4 && year > currentYear) {
                    swal('Intermediate Year can not be in future year');
                    $("#intermediate_year").val("");
                    return false;
                }
            }
            if (yearType == 'graduation_year') {
                interYear = $("#intermediate_year").val();
                if (year.length == 4 && parseInt(year) < parseInt(interYear)) {
                    swal('Graduation Year can not be before than Intermediate Year');
                    $("#graduation_year").val("");
                    return false;
                } else if (year.length == 4 && interYear.length == 4 && parseInt(year) == parseInt(interYear)) {
                    swal('Graduation Year can not be equal to Intermediate Year');
                    $("#graduation_year").val("");
                    return false;
                } else if (year.length == 4 && parseInt(year) > parseInt(currentYear)) {
                    swal('Graduation Year can not be in future year');
                    $("#graduation_year").val("");
                    return false;
                }
            }
            if (yearType == 'gnm_year') {
                interYear = $("#intermediate_year").val();
                if (year.length == 4 && year < interYear) {
                    swal('GNM Year can not be before than Intermediate Year');
                    $("#gnm_year").val("");
                    return false;
                } else if (year.length == 4 && year > currentYear) {
                    swal('GNM Year can not be in future year');
                    $("#gnm_year").val("");
                    return false;
                }
            }

        }



        function check10Status(status10) {
            //console.log(status10);
            if ($("#promotedStatus").prop('checked') == true) {
                $('#promotedCheckStatus').val('2');
                $("#high_school_max_marks").attr('disabled', true);
                $("#high_school_max_marks").attr('required', false);
                $("#high_school_obtained_marks").attr('disabled', true);
                $("#high_school_obtained_marks").attr('required', false);
                $("#high_school_percentage_marks").attr('disabled', true);
                $("#high_school_percentage_marks").attr('required', false);
                $("#high_school_max_marks").val('');
                $("#high_school_obtained_marks").val('');
                $("#high_school_percentage_marks").val('');
                $("#high_school_division").val('');
                $("#sci_mm").val('');
                $("#sci_mm").attr('disabled', true);
                $("#sci_mm").attr('required', false);
                $("#sci_om").val('');
                $("#sci_om").attr('disabled', true);
                $("#sci_om").attr('required', false);

                $("#maths_mm").val('');
                $("#maths_mm").attr('disabled', true);
                $("#maths_mm").attr('required', false);
                $("#maths_om").val('');
                $("#maths_om").attr('disabled', true);
                $("#maths_om").attr('required', false);

                $("#sosci_mm").val('');
                $("#sosci_mm").attr('disabled', true);
                $("#sosci_mm").attr('required', false);
                $("#sosci_om").val('');
                $("#sosci_om").attr('disabled', true);
                $("#sosci_om").attr('required', false);

                $("#eng10_mm").val('');
                $("#eng10_mm").attr('disabled', true);
                $("#eng10_mm").attr('required', false);
                $("#eng10_om").val('');
                $("#eng10_om").attr('disabled', true);
                $("#eng10_om").attr('required', false);

                $("#hin_mm").val('');
                $("#hin_mm").attr('disabled', true);
                $("#hin_mm").attr('required', false);
                $("#hin_om").val('');
                $("#hin_om").attr('disabled', true);
                $("#hin_om").attr('required', false);


            } else {
                $('#promotedCheckStatus').val('1');
                $("#high_school_max_marks").attr('disabled', false);
                $("#high_school_max_marks").attr('required', true);
                $("#high_school_obtained_marks").attr('disabled', false);
                $("#high_school_obtained_marks").attr('required', true);
                $("#high_school_percentage_marks").attr('disabled', false);
                $("#high_school_percentage_marks").attr('required', true);

                $("#sci_mm").attr('disabled', false);
                $("#sci_mm").attr('required', true);
                $("#sci_om").attr('disabled', false);
                $("#sci_om").attr('required', true);
                $("#maths_mm").attr('disabled', false);
                $("#maths_mm").attr('required', true);
                $("#maths_om").attr('disabled', false);
                $("#maths_om").attr('required', true);
                $("#sosci_mm").attr('disabled', false);
                $("#sosci_mm").attr('required', true);
                $("#sosci_om").attr('disabled', false);
                $("#sosci_om").attr('required', true);
                $("#eng10_mm").attr('disabled', false);
                $("#eng10_mm").attr('required', true);
                $("#eng10_om").attr('disabled', false);
                $("#eng10_om").attr('required', true);
                $("#hin_mm").attr('disabled', false);
                $("#hin_mm").attr('required', true);
                $("#hin_om").attr('disabled', false);
                $("#hin_om").attr('required', true);

            }
        }

        function checkInterStatus(intermediatestaus) {

            if (intermediatestaus == '2') {
                $('#intermediateCheckStatus').val('2');
                $("#intermediate_max_marks").attr('disabled', true);
                $("#intermediate_max_marks").attr('required', false);
                $("#intermediate_obtained_marks").attr('disabled', true);
                $("#intermediate_obtained_marks").attr('required', false);
                $("#intermediate_percentage_marks").attr('disabled', true);
                $("#intermediate_percentage_marks").attr('required', false);
                $("#intermediate_division").attr('disabled', true);
                $("#intermediate_division").attr('required', false);
                $("#intermediate_max_marks").val('');
                $("#intermediate_obtained_marks").val('');
                $("#intermediate_percentage_marks").val('');
                $("#intermediate_division").val('');
                $("#bio_mm").attr('disabled', true);
                $("#bio_mm").attr('required', false);
                $("#bio_om").attr('disabled', true);
                $("#bio_om").attr('required', false);
                $("#phy_mm").attr('disabled', true);
                $("#phy_mm").attr('required', false);
                $("#phy_om").attr('disabled', true);
                $("#phy_om").attr('required', false);
                $("#che_mm").attr('disabled', true);
                $("#che_mm").attr('required', false);
                $("#che_om").attr('disabled', true);
                $("#che_om").attr('required', false);
                $("#eng_mm").attr('disabled', true);
                $("#eng_mm").attr('required', false);
                $("#eng_om").attr('disabled', true);
                $("#eng_om").attr('required', false);

            } else {
                $('#intermediateCheckStatus').val('1');
                $("#intermediate_max_marks").attr('disabled', false);
                $("#intermediate_max_marks").attr('required', true);
                $("#intermediate_obtained_marks").attr('disabled', false);
                $("#intermediate_obtained_marks").attr('required', true);
                $("#intermediate_percentage_marks").attr('disabled', false);
                $("#intermediate_percentage_marks").attr('required', true);
                $("#intermediate_division").attr('disabled', false);
                $("#intermediate_division").attr('required', true);
                $("#bio_mm").attr('disabled', false);
                $("#bio_mm").attr('required', true);
                $("#bio_om").attr('disabled', false);
                $("#bio_om").attr('required', true);
                $("#phy_mm").attr('disabled', false);
                $("#phy_mm").attr('required', true);
                $("#phy_om").attr('disabled', false);
                $("#phy_om").attr('required', true);
                $("#che_mm").attr('disabled', false);
                $("#che_mm").attr('required', true);
                $("#che_om").attr('disabled', false);
                $("#che_om").attr('required', true);
                $("#eng_mm").attr('disabled', false);
                $("#eng_mm").attr('required', true);
                $("#eng_om").attr('disabled', false);
                $("#eng_om").attr('required', true);
            }
        }

        function checkGNMStatus(gnmstatus) {

            if (gnmstatus == '2') {
                $("#gnm_max_marks").attr('disabled', true);
                $("#gnm_max_marks").attr('required', false);
                $("#gnm_obtained_marks").attr('disabled', true);
                $("#gnm_obtained_marks").attr('required', false);
                $("#gnm_percentage_marks").attr('disabled', true);
                $("#gnm_percentage_marks").attr('required', false);
                $("#gnm_division").attr('disabled', true);
                $("#gnm_division").attr('required', false);
                $("#gnm_max_marks").val('');
                $("#gnm_obtained_marks").val('');
                $("#gnm_percentage_marks").val('');
                $("#gnm_division").val('');
                $("#gnm_up_reg_no").attr('disabled', true);
                $("#gnm_up_reg_no").attr('required', false);
                $("#gnm_up_reg_no").val('');
                $("#gnm_regno_state").attr('disabled', true);
                $("#gnm_regno_state").attr('required', false);
                $("#gnm_regno_state").val('');

            } else {
                $("#gnm_max_marks").attr('disabled', false);
                $("#gnm_max_marks").attr('required', true);
                $("#gnm_obtained_marks").attr('disabled', false);
                $("#gnm_obtained_marks").attr('required', true);
                $("#gnm_percentage_marks").attr('disabled', false);
                $("#gnm_percentage_marks").attr('required', true);
                $("#gnm_division").attr('disabled', false);
                $("#gnm_division").attr('required', true);
                $("#gnm_up_reg_no").attr('disabled', false);
                $("#gnm_up_reg_no").attr('required', true);
                $("#gnm_regno_state").attr('disabled', false);
                $("#gnm_regno_state").attr('required', true);
            }
        }


        $(document).on('click', '.newRowNonTeachingExperience', function() {
            $("#tableNonTeachingExperience").append(`<tr>
                                        <td style="width:22%">
                                            <input type="text" name="dept_inst_off_exp[]" value=""  data-parsley-pattern-message="Must Contains Character in Institute/Department Name" data-parsley-trigger="keyup" class="form-control dept_inst_off_exp text-uppercase">
                                        </td>
                                        <td style="width:23%">
                                            <select name="nature_work_exp[]" id="nature_work_exp"  class="form-control">
                                                <option value=""> --Please Select --</option>
                                                <option value="CLINICAL">CLINICAL</option>
                                                <option value="ACADEMIC">ACADEMIC</option>
                                            </select>
                                        </td>
                                        <td style="width:13%">
                                            <div class="input-group mb-3">
                                                <div class="input-group-prepend">
                                                  <span class="input-group-text" id="basic-addon1">From</span>
                                                </div>
                                                <input  max="2026-05-22" type="date" name="from_exp[]" class="form-control from_exp"  aria-describedby="basic-addon1">
                                            </div>
                                            <div class="input-group mb-3">
                                                <div class="input-group-prepend">
                                                  <span class="input-group-text" id="basic-addon1">To</span>
                                                </div>
                                                <input  max="2026-05-22" type="date" name="to_exp[]" class="form-control to_exp"  aria-describedby="basic-addon1">
                                            </div>
                                        </td>
                                        <td style="width:20%">
                                            <label for="" class="mx-5 btn btn-outline-dark newRowNonTeachingExperience"><i class="fa fa-plus text-success"></i></label>
                                            <label for="" class="btn btn-outline-danger removeRowNonTeachingExperience"><i class="fa fa-minus text-danger" ></i></label>
                                            </td>
                                        </tr>`);
        });

        $("#tableNonTeachingExperience").on("click", ".removeRowNonTeachingExperience", function(e) {
            e.preventDefault();
            $(this).closest("tr").remove();
        });


        
        function hideShowExperienceANM(status)
        {
            if(status == 1)
            {
                $("#InServieANMExperienceTable").removeClass('d-none')
            }
            else
            {
                $("#InServieANMExperienceTable").addClass('d-none')
            }
        }

        $(document).on('click', '.newRowANMExperience', function() {
            $("#tableANMExperience").append(`<tr>
                                        <td style="width:35%">
                                            <select name="dept_inst_off_exp[]"
                                                id="dept_inst_off_exp" class="form-control">
                                                <option value="">Select Institute</option>
                                                <option value='DGMH'>DGMH</option>
                                                <option value='NRHM'>NRHM</option>
                                                <option value='NHM'>NHM</option>
                                            </select>
                                        </td>
                                        <td style="width:35%">
                                            <select name="exp_district[]"
                                                id="exp_district" class="form-control">
                                                <option value="">Select District</option>
                                                                                                    <option value="AGRA">AGRA</option>
                                                                                                    <option value="ALIGARH">ALIGARH</option>
                                                                                                    <option value="AMBEDKAR NAGAR">AMBEDKAR NAGAR</option>
                                                                                                    <option value="AMETHI">AMETHI</option>
                                                                                                    <option value="AMROHA">AMROHA</option>
                                                                                                    <option value="AURAIYA">AURAIYA</option>
                                                                                                    <option value="AYODHYA">AYODHYA</option>
                                                                                                    <option value="AZAMGARH">AZAMGARH</option>
                                                                                                    <option value="BAGHPAT">BAGHPAT</option>
                                                                                                    <option value="BAHRAICH">BAHRAICH</option>
                                                                                                    <option value="BALLIA">BALLIA</option>
                                                                                                    <option value="BALRAMPUR">BALRAMPUR</option>
                                                                                                    <option value="BANDA">BANDA</option>
                                                                                                    <option value="BARABANKI">BARABANKI</option>
                                                                                                    <option value="BAREILLY">BAREILLY</option>
                                                                                                    <option value="BASTI">BASTI</option>
                                                                                                    <option value="BHADOHI">BHADOHI</option>
                                                                                                    <option value="BIJNOR">BIJNOR</option>
                                                                                                    <option value="BUDAUN">BUDAUN</option>
                                                                                                    <option value="BULANDSHAHR">BULANDSHAHR</option>
                                                                                                    <option value="CHANDAULI">CHANDAULI</option>
                                                                                                    <option value="CHITRAKOOT">CHITRAKOOT</option>
                                                                                                    <option value="DEORIA">DEORIA</option>
                                                                                                    <option value="ETAH">ETAH</option>
                                                                                                    <option value="ETAWAH">ETAWAH</option>
                                                                                                    <option value="FARRUKHABAD">FARRUKHABAD</option>
                                                                                                    <option value="FATEHPUR">FATEHPUR</option>
                                                                                                    <option value="FIROZABAD">FIROZABAD</option>
                                                                                                    <option value="GAUTAM BUDDHA NAGAR">GAUTAM BUDDHA NAGAR</option>
                                                                                                    <option value="GHAZIABAD">GHAZIABAD</option>
                                                                                                    <option value="GHAZIPUR">GHAZIPUR</option>
                                                                                                    <option value="GONDA">GONDA</option>
                                                                                                    <option value="GORAKHPUR">GORAKHPUR</option>
                                                                                                    <option value="HAMIRPUR">HAMIRPUR</option>
                                                                                                    <option value="HAPUR">HAPUR</option>
                                                                                                    <option value="HARDOI">HARDOI</option>
                                                                                                    <option value="HATHRAS">HATHRAS</option>
                                                                                                    <option value="JALAUN">JALAUN</option>
                                                                                                    <option value="JAUNPUR">JAUNPUR</option>
                                                                                                    <option value="JHANSI">JHANSI</option>
                                                                                                    <option value="KANNAUJ">KANNAUJ</option>
                                                                                                    <option value="KANPUR DEHAT">KANPUR DEHAT</option>
                                                                                                    <option value="KANPUR NAGAR">KANPUR NAGAR</option>
                                                                                                    <option value="KASGANJ">KASGANJ</option>
                                                                                                    <option value="KAUSHAMBI">KAUSHAMBI</option>
                                                                                                    <option value="KHERI">KHERI</option>
                                                                                                    <option value="KUSHINAGAR">KUSHINAGAR</option>
                                                                                                    <option value="LALITPUR">LALITPUR</option>
                                                                                                    <option value="LUCKNOW">LUCKNOW</option>
                                                                                                    <option value="MAHARAJGANJ">MAHARAJGANJ</option>
                                                                                                    <option value="MAHOBA">MAHOBA</option>
                                                                                                    <option value="MAINPURI">MAINPURI</option>
                                                                                                    <option value="MATHURA">MATHURA</option>
                                                                                                    <option value="MAU">MAU</option>
                                                                                                    <option value="MEERUT">MEERUT</option>
                                                                                                    <option value="MIRZAPUR">MIRZAPUR</option>
                                                                                                    <option value="MORADABAD">MORADABAD</option>
                                                                                                    <option value="MUZAFFARNAGAR">MUZAFFARNAGAR</option>
                                                                                                    <option value="PILIBHIT">PILIBHIT</option>
                                                                                                    <option value="PRATAPGARH">PRATAPGARH</option>
                                                                                                    <option value="PRAYAGRAJ">PRAYAGRAJ</option>
                                                                                                    <option value="RAEBARELI">RAEBARELI</option>
                                                                                                    <option value="RAMPUR">RAMPUR</option>
                                                                                                    <option value="SAHARANPUR">SAHARANPUR</option>
                                                                                                    <option value="SAMBHAL">SAMBHAL</option>
                                                                                                    <option value="SANT KABIR NAGAR">SANT KABIR NAGAR</option>
                                                                                                    <option value="SHAHJAHANPUR">SHAHJAHANPUR</option>
                                                                                                    <option value="SHAMLI">SHAMLI</option>
                                                                                                    <option value="SHRAVASTI">SHRAVASTI</option>
                                                                                                    <option value="SIDDHARTHNAGAR">SIDDHARTHNAGAR</option>
                                                                                                    <option value="SITAPUR">SITAPUR</option>
                                                                                                    <option value="SONBHADRA">SONBHADRA</option>
                                                                                                    <option value="SULTANPUR">SULTANPUR</option>
                                                                                                    <option value="UNNAO">UNNAO</option>
                                                                                                    <option value="VARANASI">VARANASI</option>
                                                                                            </select>
                                        </td>
                                        <td style="width:35%">
                                            <div class="input-group mb-3">
                                                <div class="input-group-prepend">
                                                  <span class="input-group-text" id="basic-addon1">From</span>
                                                </div>
                                                <input  max="2026-05-22" type="date" name="from_exp[]" class="form-control from_exp"  aria-describedby="basic-addon1">
                                            </div>
                                            <div class="input-group mb-3">
                                                <div class="input-group-prepend">
                                                  <span class="input-group-text" id="basic-addon1">To</span>
                                                </div>
                                                <input  max="2026-05-22" type="date" name="to_exp[]" class="form-control to_exp"  aria-describedby="basic-addon1">
                                            </div>
                                        </td>
                                        <td style="width:30%" class="d-none">
                                            <label for="" class="mx-5 btn btn-outline-dark newRowANMExperience"><i class="fa fa-plus text-success"></i></label>
                                            <label for="" class="btn btn-outline-danger removeRowANMExperience"><i class="fa fa-minus text-danger" ></i></label>
                                            </td>
                                        </tr>`);
        });

        $("#tableANMExperience").on("click", ".removeRowANMExperience", function(e) {
            e.preventDefault();
            $(this).closest("tr").remove();
        });

        function checkApplicantPunishedByCourt(punishment_status) {
            if (punishment_status == 'Yes') {
                $("#punishment_status").removeClass('d-none');
            } else {
                $("#punishment_status").addClass('d-none');
            }
        }

        function checkApplicantGovService(applicant_gov_service) {
            if (applicant_gov_service == 'Yes') {
                $(".deptProceedingBlock").removeClass('d-none');
            } else {
                $(".deptProceedingBlock").addClass('d-none');
            }
        }

        function checkDepartmentalProceeding(dept_proceeding) {
            if (dept_proceeding == 'Yes') {
                $("#dept_proceeding_status").removeClass('d-none');
            } else {
                $("#dept_proceeding_status").addClass('d-none');
            }
        }

        $(document).ready(function() {

            //getBoards();
            var date = $("#dob").val();
            var datearray = date.split("/");
            var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
            //let age = getAge(newdate);
            //$("#age").val(age);
            $("#btn_PartOne").removeClass('d-none');
            $("#formPart1").parsley();
            $("#formPart2").parsley();
            $("#formPart3").parsley();
            $("#formPart4").parsley();
            $("#formPart5").parsley();
            $(document).on('click', '#previousToPersonal', function() {
                //console.log('previousToPersonal');
                loader();
                $('input').removeClass('parsley-success');
                $('#PartTwoDetails').addClass('inactive_tab1');
                $('#PartTwoDetails').removeClass('active_tab1 active');
                $('#PartTwoDetails').attr('href', '#PartTwo');
                $('#PartTwoDetails').attr('data-toggle', 'tab');
                $('#PartTwo').removeClass('active show');
                $('#PartOneDetails').addClass('active active_tab1');
                $('#PartOneDetails').attr('href data-toggle');
                $('#PartOne').addClass('active');
                $('#PartOneDetails').removeClass('inactive_tab1');
                hideLoader();
            });

            $(document).on('click', '#previousToCommunication', function() {
                //console.log('previousToCommunication');
                loader();
                $('input').removeClass('parsley-success');
                $('#PartTwoDetails').addClass('active active_tab1');
                $('#PartTwoDetails').attr('href data-toggle');
                $('#PartTwo').addClass('active');
                $('#PartTwoDetails').removeClass('inactive_tab1');
                $('#PartThreeDetails').addClass('inactive_tab1');
                $('#PartThreeDetails').removeClass('active_tab1 active');
                $('#PartThreeDetails').attr('href', '#PartThree');
                $('#PartThreeDetails').attr('data-toggle', 'tab');
                $('#PartThree').removeClass('active show');
                hideLoader()
            });
            $(document).on('click', '#previousToQualification', function() {
                //console.log('previousToQualification');
                loader();
                $('input').removeClass('parsley-success');
                $('#PartThreeDetails').addClass('active active_tab1');
                $('#PartThreeDetails').attr('href data-toggle');
                $('#PartThree').addClass('active');
                $('#PartThreeDetails').removeClass('inactive_tab1');
                $('#PartFourDetails').addClass('inactive_tab1');
                $('#PartFourDetails').removeClass('active_tab1 active');
                $('#PartFourDetails').attr('href', '#PartFour');
                $('#PartFourDetails').attr('data-toggle', 'tab');
                $('#PartFour').removeClass('active show');
                hideLoader();
            });
            $(document).on('click', '#previousToPhoto', function() {
                //console.log('previousToPhoto');
                loader();
                $('input').removeClass('parsley-success');
                $('#PartFourDetails').addClass('active active_tab1');
                $('#PartFourDetails').attr('href data-toggle');
                $('#PartFour').addClass('active');
                $('#PartFourDetails').removeClass('inactive_tab1');
                $('#PartFiveDetails').addClass('inactive_tab1');
                $('#PartFiveDetails').removeClass('active_tab1 active');
                $('#PartFiveDetails').attr('href', '#PartFive');
                $('#PartFiveDetails').attr('data-toggle', 'tab');
                $('#PartFive').removeClass('active show');
                hideLoader()
            });

        });


        $(document).on('click', '#samAsPermanent', function(e) {
            if ($(this).is(':checked', true)) {
                $("#correspondence_street").val($("#permanent_street").val());
                $("#correspondence_mohalla").val($("#permanent_mohalla").val());
                $("#correspondence_state").val($("#permanent_state").val());
                getDistrictCorrespondence($("#permanent_state").val(), '1');
                $("#correspondence_city").val($("#permanent_city").val());
                $("#correspondence_pincode").val($("#permanent_pincode").val());
            } else {
                $("#correspondence_street").val("");
                $("#correspondence_mohalla").val("");
                $("#correspondence_city").val("");
                $("#correspondence_state").val("");
                $("#correspondence_pincode").val("");
            }
        });

        $(document).ready(function() {

            $('#btn_PartOne').click(function() {
                $("#formPart1").parsley();
                $("#formPart1").one('submit', function(event) {
                    event.preventDefault();
                    $(this).parsley().validate();
                    if ($(this).parsley().isValid()) {
                        loader();
                        $.ajax({
                            url: "https://www.abvmucet26.co.in/entrance2026/cetApplicationPersonalDetails",
                            method: "POST",
                            data: $("#formPart1").serialize(),
                            success: function(response) {
                                $('#cover-spin').hide(0);
                                //console.log(response);

                                if (response.status == 'success') {
                                    $('#PartOneDetails').removeClass(
                                        'active active_tab1');
                                    $('#PartOneDetails').removeAttr('href data-toggle');
                                    $('#PartOne').removeClass('active');
                                    $('#PartOneDetails').addClass('inactive_tab1');
                                    $('#PartTwoDetails').removeClass('inactive_tab1');
                                    $('#PartTwoDetails').addClass('active_tab1 active');
                                    $('#PartTwoDetails').attr('href', '#PartTwo');
                                    $('#PartTwoDetails').attr('data-toggle', 'tab');
                                    $('#PartTwo').addClass('active show');
                                } else {
                                    swal({
                                        title: 'Error',
                                        text: response.message,
                                        icon: 'error',
                                        timer: 3000,
                                        buttons: false
                                    });
                                }
                            },
                            error: function(err) {
                                console.log(err);
                                $('#cover-spin').hide(0);
                                console.log(err.responseJSON);
                                $('#success_message').fadeIn().html(err.responseJSON
                                    .message);
                                console.warn(err.responseJSON.errors);
                                $("#formPart1").find('small').remove();
                                $.each(err.responseJSON.errors, function(i, error) {
                                    var el = $("#formPart1").find('[name="' +
                                        i + '"]');
                                    el.after($('<small style="color: red;">' +
                                        error[0] + '</small>'));
                                });
                            }
                        });
                    }
                    event.preventDefault();
                });
            });

            $('#btn_PartTwo').click(function() {
                $("#formPart2").parsley();
                $("#formPart2").one('submit', function(event) {
                    event.preventDefault();
                    $(this).parsley().validate();
                    if ($(this).parsley().isValid()) {
                        loader();
                        $.ajax({
                            url: "https://www.abvmucet26.co.in/entrance2026/cetApplicationCommunicationDetails",
                            method: "POST",
                            data: $("#formPart2").serialize(),
                            success: function(response) {
                                $('#cover-spin').hide(0);
                                //console.log(response);
                                if (response.status == 'success') {
                                    $('#PartOneDetails').removeClass(
                                        'active active_tab1');
                                    $('#PartOneDetails').removeAttr('href data-toggle');
                                    $('#PartOne').removeClass('active');
                                    $('#PartOneDetails').addClass('inactive_tab1');
                                    $('#PartTwoDetails').removeClass(
                                        'active active_tab1');
                                    $('#PartTwoDetails').removeAttr('href data-toggle');
                                    $('#PartTwo').removeClass('active');
                                    $('#PartTwoDetails').addClass('inactive_tab1');
                                    $('#PartThreeDetails').removeClass('inactive_tab1');
                                    $('#PartThreeDetails').addClass(
                                        'active_tab1 active');
                                    $('#PartThreeDetails').attr('href', '#PartThree');
                                    $('#PartThreeDetails').attr('data-toggle', 'tab');
                                    $('#PartThree').addClass('active show');
                                } else {
                                    swal({
                                        title: 'Error',
                                        text: response.message,
                                        icon: 'error',
                                        timer: 3000,
                                        buttons: false
                                    });
                                }
                            },
                            error: function(err) {
                                console.log(err);
                                $('#cover-spin').hide(0);
                                console.log(err.responseJSON);
                                $('#success_message').fadeIn().html(err.responseJSON
                                    .message);
                                console.warn(err.responseJSON.errors);
                                $("#formPart2").find('small').remove();
                                $.each(err.responseJSON.errors, function(i, error) {
                                    var el = $("#formPart2").find('[name="' +
                                        i + '"]');
                                    el.after($('<small style="color: red;">' +
                                        error[0] + '</small>'));
                                });
                            }
                        });
                    }
                });
            });

 $('#btn_PartThree').click(function() {
    $("#formPart3").parsley();
    $("#formPart3").one('submit', function(event) {
        event.preventDefault();
        $(this).parsley().validate();
        if ($(this).parsley().isValid()) {

            // Condition: Graduation year should not be less than or equal to Inter year
            // var graduationYear = $("#graduation_year").val();
            // var interYear = $("#intermediate_year").val();
            // if (graduationYear.length == 4 && interYear.length == 4) {
            //     if (parseInt(graduationYear) <= parseInt(interYear)) {
            //         swal('Error',
            //             'Graduation Passing Year cannot be less than or equal to 12th Passing Year',
            //             'error');
            //         return false;
            //     }
            // }
                        loader();
                        $.ajax({
                            url: "https://www.abvmucet26.co.in/entrance2026/cetApplicationQualificationDetails",
                            method: "POST",
                            data: $("#formPart3").serialize(),
                            success: function(response) {
                                $('#cover-spin').hide(0);
                                //console.log(response);
                                if (response.status == 'success') {
                                    $('#PartOneDetails').removeClass(
                                        'active active_tab1');
                                    $('#PartOneDetails').removeAttr('href data-toggle');
                                    $('#PartOne').removeClass('active');
                                    $('#PartOneDetails').addClass('inactive_tab1');
                                    $('#PartThreeDetails').removeClass(
                                        'active active_tab1');
                                    $('#PartThreeDetails').removeAttr(
                                        'href data-toggle');
                                    $('#PartThree').removeClass('active');
                                    $('#PartThreeDetails').addClass('inactive_tab1');
                                    $('#PartFourDetails').removeClass('inactive_tab1');
                                    $('#PartFourDetails').addClass(
                                        'active_tab1 active');
                                    $('#PartFourDetails').attr('href', '#PartFour');
                                    $('#PartFourDetails').attr('data-toggle', 'tab');
                                    $('#PartFour').addClass('active show');
                                } else {
                                    swal({
                                        title: 'Error',
                                        text: response.message,
                                        icon: 'error',
                                        timer: 3000,
                                        buttons: false
                                    });
                                }
                            },
                            error: function(err) {
                                console.log(err);
                                $('#cover-spin').hide(0);
                                console.log(err.responseJSON);
                                $('#success_message').fadeIn().html(err.responseJSON
                                    .message);
                                console.warn(err.responseJSON.errors);
                                $("#formPart3").find('small').remove();
                                $.each(err.responseJSON.errors, function(i, error) {
                                    var el = $("#formPart3").find('[name="' +
                                        i + '"]');
                                    el.after($('<small style="color: red;">' +
                                        error[0] + '</small>'));
                                });
                            }
                        });
                    }
                });
            });

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                    // 'Content-Type':'application/json'
                }
            });

            $('#btn_PartFour').click(function() {
                $("#formPart4").parsley();
                $("#formPart4").one('submit', function(event) {
                    event.preventDefault();
                    if ($(this).parsley().isValid()) {
                        loader();
                        $.ajax({
                            url: "https://www.abvmucet26.co.in/entrance2026/cetApplicationPhotoSign",
                            method: "POST",
                            data: new FormData(this),
                            contentType: false,
                            processData: false,
                            success: function(response) {
                                $('#cover-spin').hide(0);
                                //console.log(response);
                                if (response.status == 'success') {
                                                                            var swalmsg =
                                            " 'Save & Preview' button will take you to the form preview page where you can verify the infomation and proceed further to Pay Fee. 'Save & Preview' बटन आपको फॉर्म पूर्वावलोकन पृष्ठ पर ले जाएगा जहां आप जानकारी सत्यापित कर सकते हैं और शुल्क का भुगतान करने के लिए आगे बढ़ सकते हैं। "
                                    
                                    swal({
                                            title: swalmsg,
                                            text: "",
                                            icon: "warning",
                                            dangerMode: true,
                                            buttons: {
                                                cancel: 'No',
                                                confirm: {
                                                    text: 'Yes',
                                                    className: 'sweet-warning'
                                                },
                                            }

                                        })
                                        .then((willDelete) => {
                                            if (willDelete) {
                                                swal({
                                                    title: 'Done',
                                                    text: response.message,
                                                    icon: 'success',
                                                    timer: 3000,
                                                    buttons: false
                                                });
                                                window.location.href =
                                                    "https://www.abvmucet26.co.in/entrance2026/cetApplicationPreview/eyJpdiI6InNrL3Z0NmJjNUV1MFUySHpCbDdXd0E9PSIsInZhbHVlIjoiS1RWYzc0R0FoY2MzS3dPdVI2NTBBZz09IiwibWFjIjoiZTMwZWQyMWJlNzQyMjQ0MGFmZjZmYmRiNWRhYWI5YjZiMTAwMTNiNTc4MDNmYmYyZWE0ODIwZTEwZTMzNDEwZCIsInRhZyI6IiJ9";
                                            }
                                        });

                                } else {
                                    swal({
                                        title: 'Error',
                                        text: response.message,
                                        icon: 'error',
                                        timer: 3000,
                                        buttons: false
                                    });
                                }
                            },
                            error: function(err) {
                                console.log(err);
                                $('#cover-spin').hide(0);
                                console.log(err.responseJSON);
                                $('#success_message').fadeIn().html(err.responseJSON
                                    .message);
                                console.warn(err.responseJSON.errors);
                                $("#formPart4").find('small').remove();
                                $.each(err.responseJSON.errors, function(i, error) {
                                    var el = $("#formPart4").find('[name="' +
                                        i + '"]');
                                    el.after($('<small style="color: red;">' +
                                        error[0] + '</small>'));
                                });
                            }
                        });
                    }
                });
            });


        });


        function calculationBox() {
            var high_school_max_marks = $('#high_school_max_marks').val();
            var high_school_obtained_marks = $('#high_school_obtained_marks').val();
            var high_school_percentage_marks = $('#high_school_percentage_marks').val();
            var intermediate_max_marks = $('#intermediate_max_marks').val();
            var intermediate_obtained_marks = $('#intermediate_obtained_marks').val();
            var intermediate_percentage_marks = $('#intermediate_percentage_marks').val();
            var gnm_max_marks = $('#gnm_max_marks').val();
            var gnm_obtained_marks = $('#gnm_obtained_marks').val();
            var gnm_percentage_marks = $('#gnm_percentage_marks').val();
            var graduation_max_marks = $('#graduation_max_marks').val();
            var graduation_obtained_marks = $('#graduation_obtained_marks').val();
            var graduation_percentage_marks = $('#graduation_percentage_marks').val();
            var diploma_max_marks = $('#diploma_max_marks').val();
            var diploma_obtained_marks = $('#diploma_obtained_marks').val();
            var diploma_percentage_marks = $('#diploma_percentage_marks').val();
            var internship_max_marks = $('#internship_max_marks').val();
            var internship_obtained_marks = $('#internship_obtained_marks').val();
            var internship_percentage_marks = $('#internship_percentage_marks').val();

            var anm_max_marks = $('#anm_max_marks').val();
            var anm_obtained_marks = $('#anm_obtained_marks').val();
            var anm_percentage_marks = $('#anm_percentage_marks').val();

            if (high_school_max_marks != '' && high_school_obtained_marks != '' && parseFloat(high_school_max_marks) >=
                parseFloat(high_school_obtained_marks)) {
                var percentageMarks = txtpercentage(high_school_obtained_marks, high_school_max_marks);
                $('#high_school_percentage_marks').val(percentageMarks);
            } else {
                if (parseFloat(high_school_max_marks) >= parseFloat(high_school_obtained_marks)) {} else if (
                    high_school_max_marks != '' && high_school_obtained_marks != '') {
                    swal("Marks obtained are greater than maximum marks.");
                    $('#high_school_obtained_marks').val('');
                    $('#high_school_percentage_marks').val('');
                }
            }

            if (intermediate_max_marks != '' && intermediate_obtained_marks != '' && parseFloat(intermediate_max_marks) >=
                parseFloat(intermediate_obtained_marks)) {
                var percentageMarks = txtpercentage(intermediate_obtained_marks, intermediate_max_marks);
                $('#intermediate_percentage_marks').val(percentageMarks);
            } else {
                if (parseFloat(intermediate_max_marks) >= parseFloat(intermediate_obtained_marks)) {} else if (
                    intermediate_max_marks != '' && intermediate_obtained_marks != '') {
                    swal("Marks obtained are greater than maximum marks.");
                }
                $('#intermediate_obtained_marks').val('');
                $('#intermediate_percentage_marks').val('');
            }

            if (gnm_max_marks != '' && gnm_obtained_marks != '' && parseFloat(gnm_max_marks) >= parseFloat(
                    gnm_obtained_marks)) {
                var percentageMarks = txtpercentage(gnm_obtained_marks, gnm_max_marks);
                $('#gnm_percentage_marks').val(percentageMarks);
            } else {
                if (parseFloat(gnm_max_marks) >= parseFloat(gnm_obtained_marks)) {} else if (gnm_max_marks != '' &&
                    gnm_obtained_marks != '') {
                    //swal("Marks obtained are greater than maximum marks.");
                }
                $('#gnm_obtained_marks').val('');
                $('#gnm_percentage_marks').val('');
            }
            if (anm_max_marks != '' && anm_obtained_marks != '' && parseFloat(anm_max_marks) >= parseFloat(
                    anm_obtained_marks)) {
                var percentageMarks = txtpercentage(anm_obtained_marks, anm_max_marks);
                $('#anm_percentage_marks').val(percentageMarks);
            } else {
                if (parseFloat(anm_max_marks) >= parseFloat(anm_obtained_marks)) {} else if (anm_max_marks != '' &&
                    anm_obtained_marks != '') {
                    //swal("Marks obtained are greater than maximum marks.");
                }
                $('#anm_obtained_marks').val('');
                $('#anm_percentage_marks').val('');
            }
            if (graduation_max_marks != '' && graduation_obtained_marks != '' && parseFloat(graduation_max_marks) >=
                parseFloat(graduation_obtained_marks)) {
                var percentageMarks = txtpercentage(graduation_obtained_marks, graduation_max_marks);
                $('#graduation_percentage_marks').val(percentageMarks);
            } else {
                if (parseFloat(graduation_max_marks) >= parseFloat(graduation_obtained_marks)) {} else if (
                    graduation_max_marks != '' && graduation_obtained_marks != '') {
                    //swal("Marks obtained are greater than maximum marks.");
                }
                $('#graduation_obtained_marks').val('');
                $('#graduation_percentage_marks').val('');
            }
            if (diploma_max_marks != '' && diploma_obtained_marks != '' && parseFloat(diploma_max_marks) >= parseFloat(
                    diploma_obtained_marks)) {
                var percentageMarks = txtpercentage(diploma_obtained_marks, diploma_max_marks);
                $('#diploma_percentage_marks').val(percentageMarks);
            } else {
                if (parseFloat(diploma_max_marks) >= parseFloat(diploma_obtained_marks)) {} else if (diploma_max_marks !=
                    '' && diploma_obtained_marks != '') {
                    //swal("Marks obtained are greater than maximum marks.");
                }
                $('#diploma_obtained_marks').val('');
                $('#diploma_percentage_marks').val('');
            }
            if (internship_max_marks != '' && internship_obtained_marks != '' && parseFloat(internship_max_marks) >=
                parseFloat(internship_obtained_marks)) {
                var percentageMarks = txtpercentage(internship_obtained_marks, internship_max_marks);
                $('#internship_percentage_marks').val(percentageMarks);
            } else {
                if (parseFloat(internship_max_marks) >= parseFloat(internship_obtained_marks)) {} else if (
                    internship_max_marks != '' && internship_obtained_marks != '') {
                    //swal("Marks obtained are greater than maximum marks.");
                }
                $('#internship_obtained_marks').val('');
                $('#internship_percentage_marks').val('');
            }
        }



        $('body').click(function() {
            calculationBox();
        });

        function txtpercentage(txt1, txt2) {
            ch1 = txt1;
            ch2 = txt2;
            ch3 = (ch1 * 100) / ch2;
            return ch3.toFixed(2);
        }


        function photoFileValidation(id) {

           return true;
        }