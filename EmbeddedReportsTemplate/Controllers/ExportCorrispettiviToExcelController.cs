using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EmbeddedReportsTemplate.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace EmbeddedReportsTemplate.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize(Policy = "AuthenticatedUser")]
    public class ExportCorrispettiviToExcelController : Controller
    {
        // POST: api/ExportToExcel
        [HttpPost]
        public IActionResult Post([FromBody] ExcellData data)
        {
            MemoryStream ms = new MemoryStream();

            SpreadsheetDocument spreadsheetDocument = SpreadsheetDocument.Create(ms, DocumentFormat.OpenXml.SpreadsheetDocumentType.Workbook);
            WorkbookPart workbookPart = spreadsheetDocument.AddWorkbookPart();
            WorksheetPart worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
            Workbook workbook = new Workbook();
            Worksheet worksheet = new Worksheet();

            WorkbookStylesPart stylesPart = workbookPart.AddNewPart<WorkbookStylesPart>();
            stylesPart.Stylesheet = CreateStylesheet();
            stylesPart.Stylesheet.Save();

            SheetData sheetData = new SheetData();

            worksheet.Append(sheetData);
            worksheetPart.Worksheet = worksheet;
            worksheetPart.Worksheet.Save();

            UInt32Value currentRowIndex;
            currentRowIndex = CreateHeader(worksheet, sheetData, data);
            currentRowIndex = CreateDataTables(worksheet, sheetData, data, currentRowIndex);

            Sheets sheets = new Sheets();
            Sheet sheet = new Sheet
            {
                Name = "Registro IVA corrispettivi",
                SheetId = 1,
                Id = workbookPart.GetIdOfPart(worksheetPart)
            };

            sheets.Append(sheet);
            workbook.Append(sheets);

            spreadsheetDocument.WorkbookPart.Workbook = workbook;
            spreadsheetDocument.WorkbookPart.Workbook.Save();
            spreadsheetDocument.Close();


            byte[] content = ms.ToArray();
            ms.Seek(0, SeekOrigin.Begin);
            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml", "corrispettivi.xlsx");
        }

        private UInt32Value CreateHeader(Worksheet worksheet, SheetData sheetData, ExcellData data)
        {
            Row firstHeaderRow = new Row { RowIndex = 1 };
            Cell headerCell = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Registro IVA dei corispettivi"),
                CellReference = "A1",
                StyleIndex = 1,
            };

            firstHeaderRow.Append(headerCell);
            sheetData.Append(firstHeaderRow);

            Row secondHeaderRow = new Row { RowIndex = 3 };
            Cell companyNameCaptionCell = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Ragione sociale"),
                CellReference = "A3",
                StyleIndex = 1,
            };

            Cell companyNameValueCell = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue((string)data.Agreement.Company.Name),
                CellReference = "D3",
                StyleIndex = 0,
            };

            Cell periodCaptionCell = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Periodo"),
                CellReference = "I3",
                StyleIndex = 1,
            };

            Cell periodValueCell = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue((string)data.Period),
                CellReference = "J3",
                StyleIndex = 0,
            };


            secondHeaderRow.Append(companyNameCaptionCell, companyNameValueCell, periodCaptionCell, periodValueCell);
            sheetData.Append(secondHeaderRow);

            Row thirdHeaderRow = new Row { RowIndex = 4 };
            Cell companyVatNumberCaptionCell = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Partita IVA"),
                CellReference = "A4",
                StyleIndex = 1,
            };

            Cell companyVatNumberValueCell = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue((string)data.Agreement.Company.VatNumber),
                CellReference = "D4",
                StyleIndex = 0,
            };

            thirdHeaderRow.Append(companyVatNumberCaptionCell, companyVatNumberValueCell);
            sheetData.Append(thirdHeaderRow);


            Merge(worksheet, headerCell.CellReference, "K1");
            Merge(worksheet, companyNameCaptionCell.CellReference, "C3");
            Merge(worksheet, companyNameValueCell.CellReference, "H3");
            Merge(worksheet, periodValueCell.CellReference, "K3");
            Merge(worksheet, companyVatNumberCaptionCell.CellReference, "C4");
            Merge(worksheet, companyVatNumberValueCell.CellReference, "H4");

            return thirdHeaderRow.RowIndex;
        }

        private UInt32Value CreateDataTables(Worksheet worksheet, SheetData sheetData, ExcellData data, UInt32Value currentRowIndex)
        {
            currentRowIndex += 3;

            foreach (var page in data.Pages)
            {
                currentRowIndex = CreateDataTableHeader(worksheet, sheetData, currentRowIndex, page);

                foreach (var currentRow in page.Rows)
                {
                    currentRowIndex += 1;
                    currentRowIndex = CreateDataTableRow(worksheet, sheetData, currentRowIndex, currentRow);
                }

                if (page.Summary != null && page.Summary.Count() > 0)
                {
                    currentRowIndex += 2;
                    currentRowIndex = CreateSummaryTable(worksheet, sheetData, currentRowIndex, page);
                }

                currentRowIndex += 2;
            }

            currentRowIndex = CreateFinalSummaryTableHeader(worksheet, sheetData, currentRowIndex);
            currentRowIndex += 1;
            currentRowIndex = CreateFinalSummaryTableRows(worksheet, sheetData, currentRowIndex, data.FinalSummary, data.FinalSummaryTotals);

            return currentRowIndex;
        }

        private UInt32Value CreateDataTableHeader(Worksheet worksheet, SheetData sheetData, UInt32Value currentRowIndex,
            Models.Page currentPage)
        {
            #region NumberSeriesCaption

            Row numberSeriesRow = new Row { RowIndex = currentRowIndex };

            Cell numberSeriesValueCell = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue($"{currentPage.NumberSeriesName}"),
                CellReference = $"A{currentRowIndex}",
                StyleIndex = 1,
            };

            numberSeriesRow.Append(numberSeriesValueCell);
            sheetData.Append(numberSeriesRow);

            Merge(worksheet, numberSeriesValueCell.CellReference, $"C{currentRowIndex}");

            #endregion

            #region Table header

            currentRowIndex += 1;
            Row tableHeaderRow = new Row { RowIndex = currentRowIndex };
            Cell tableHeaderCell_Date = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Data"),
                CellReference = $"A{currentRowIndex}",
                StyleIndex = 2,
            };

            Cell tableHeaderCell_Description = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Descrizione"),
                CellReference = $"B{currentRowIndex}",
                StyleIndex = 2,
            };

            Cell tableHeaderCell_DailyTotal = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Totale"),
                CellReference = $"C{currentRowIndex}",
                StyleIndex = 2,
            };

            Cell tableHeaderCell_VatCode = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Cod. IVA"),
                CellReference = $"D{currentRowIndex}",
                StyleIndex = 2,
            };

            Cell tableHeaderCell_Amount = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Imponibile"),
                CellReference = $"E{currentRowIndex}",
                StyleIndex = 2,
            };

            Cell tableHeaderCell_Vat = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Imposta"),
                CellReference = $"F{currentRowIndex}",
                StyleIndex = 2,
            };

            Cell tableHeaderCell_Total = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Lordo"),
                CellReference = $"G{currentRowIndex}",
                StyleIndex = 2,
            };

            tableHeaderRow.Append(tableHeaderCell_Date, tableHeaderCell_Description, tableHeaderCell_DailyTotal, tableHeaderCell_VatCode,
                tableHeaderCell_Amount, tableHeaderCell_Vat, tableHeaderCell_Total);

            sheetData.Append(tableHeaderRow);

            #endregion

            return currentRowIndex;
        }

        private UInt32Value CreateDataTableRow(Worksheet worksheet, SheetData sheetData, UInt32Value currentRowIndex, PageRow pageRow)
        {
            Row tableRow = new Row { RowIndex = currentRowIndex };

            if (!string.IsNullOrWhiteSpace(pageRow.Day))
            {
                string[] dateComponents = pageRow.Day.Split('-');
                DateTime day = new DateTime(int.Parse(dateComponents[0]), int.Parse(dateComponents[1]), int.Parse(dateComponents[2]));
                Cell tableCell_Date = new Cell
                {
                    DataType = CellValues.String,
                    CellValue = new CellValue(day.ToShortDateString()),
                    CellReference = $"A{currentRowIndex}",
                    StyleIndex = 0,
                };

                Cell tableCell_Description = new Cell
                {
                    DataType = CellValues.String,
                    CellValue = new CellValue(pageRow.Description),
                    CellReference = $"B{currentRowIndex}",
                    StyleIndex = 0,
                };

                Cell tableCell_DailyTotal = new Cell
                {
                    DataType = CellValues.Number,
                    CellValue = new CellValue(Convert.ToString(pageRow.DailyTotal.Value)),
                    CellReference = $"C{currentRowIndex}",
                    StyleIndex = 0,
                };

                tableRow.Append(tableCell_Date, tableCell_Description, tableCell_DailyTotal);
            }
            else
            {
                Cell tableCell_VatCode = new Cell
                {
                    DataType = CellValues.String,
                    CellValue = new CellValue(pageRow.VatCode),
                    CellReference = $"D{currentRowIndex}",
                    StyleIndex = 0,
                };

                Cell tableCell_Amount = new Cell
                {
                    DataType = CellValues.Number,
                    CellValue = new CellValue(Convert.ToString(pageRow.Amount.Value)),
                    CellReference = $"E{currentRowIndex}",
                    StyleIndex = 0,
                };

                Cell tableCell_Vat = new Cell
                {
                    DataType = CellValues.Number,
                    CellValue = new CellValue(Convert.ToString(pageRow.Vat.Value)),
                    CellReference = $"F{currentRowIndex}",
                    StyleIndex = 0,
                };

                Cell tableCell_Total = new Cell
                {
                    DataType = CellValues.Number,
                    CellValue = new CellValue(Convert.ToString(pageRow.Total.Value)),
                    CellReference = $"G{currentRowIndex}",
                    StyleIndex = 0,
                };

                tableRow.Append(tableCell_VatCode, tableCell_Amount, tableCell_Vat, tableCell_Total);
            }

            sheetData.Append(tableRow);

            return currentRowIndex;
        }

        private UInt32Value CreateSummaryTable(Worksheet worksheet, SheetData sheetData, UInt32Value currentRowIndex, Models.Page currentPage)
        {
            currentRowIndex = CreateSummaryTableHeader(worksheet, sheetData, currentRowIndex, currentPage);
            currentRowIndex += 2;

            currentRowIndex = CreateSummaryTableRows(worksheet, sheetData, currentRowIndex, currentPage);

            return currentRowIndex;
        }

        private UInt32Value CreateSummaryTableHeader(Worksheet worksheet, SheetData sheetData, UInt32Value currentRowIndex, Models.Page currentPage)
        {
            Row summaryTableCaptionRow = new Row { RowIndex = currentRowIndex };
            Cell summaryTableCaptionCell = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue($"Riepilogo {currentPage.NumberSeriesName}"),
                CellReference = $"A{currentRowIndex}",
                StyleIndex = 1,
            };

            summaryTableCaptionRow.Append(summaryTableCaptionCell);
            sheetData.Append(summaryTableCaptionRow);

            Merge(worksheet, summaryTableCaptionCell.CellReference, $"C{currentRowIndex}");

            currentRowIndex += 1;
            Row summaryHeaderRow = new Row { RowIndex = currentRowIndex };
            Cell summaryHeaderCell_VatCode = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Cod. IVA"),
                CellReference = $"A{currentRowIndex}",
                StyleIndex = 2,
            };

            Cell summaryHeaderCell_VatDescription = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Descrizione IVA"),
                CellReference = $"B{currentRowIndex}",
                StyleIndex = 2,
            };

            Cell summaryHeaderCell_VatRate = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("% IVA"),
                CellReference = $"D{currentRowIndex}",
                StyleIndex = 2,
            };

            Cell summaryHeaderCell_Amount = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Imponibile"),
                CellReference = $"E{currentRowIndex}",
                StyleIndex = 2,
            };

            Cell summaryHeaderCell_Vat = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Imposta"),
                CellReference = $"F{currentRowIndex}",
                StyleIndex = 2,
            };

            Cell summaryHeaderCell_Total = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Totale"),
                CellReference = $"G{currentRowIndex}",
                StyleIndex = 2,
            };

            summaryHeaderRow.Append(summaryHeaderCell_VatCode, summaryHeaderCell_VatDescription, summaryHeaderCell_VatRate,
                summaryHeaderCell_Amount, summaryHeaderCell_Vat, summaryHeaderCell_Total);

            sheetData.Append(summaryHeaderRow);

            Merge(worksheet, summaryHeaderCell_VatDescription.CellReference, $"C{currentRowIndex}");

            return currentRowIndex;
        }

        private UInt32Value CreateSummaryTableRows(Worksheet worksheet, SheetData sheetData, UInt32Value currentRowIndex, Models.Page currentPage)
        {
            foreach (var item in currentPage.Summary)
            {
                Row summaryRow = new Row { RowIndex = currentRowIndex };
                Cell summaryCell_VatCode = new Cell
                {
                    DataType = CellValues.String,
                    CellValue = new CellValue(item.VatCode),
                    CellReference = $"A{currentRowIndex}",
                    StyleIndex = 0,
                };

                Cell summaryCell_VatDescription = new Cell
                {
                    DataType = CellValues.String,
                    CellValue = new CellValue(item.VatDescription),
                    CellReference = $"B{currentRowIndex}",
                    StyleIndex = 0,
                };

                Cell summaryCell_VatRate = new Cell
                {
                    DataType = CellValues.Number,
                    CellValue = new CellValue(Convert.ToString(item.RatePercentage.Value)),
                    CellReference = $"D{currentRowIndex}",
                    StyleIndex = 0,
                };

                Cell summaryCell_Amount = new Cell
                {
                    DataType = CellValues.Number,
                    CellValue = new CellValue(Convert.ToString(item.Amount.Value)),
                    CellReference = $"E{currentRowIndex}",
                    StyleIndex = 0,
                };

                Cell summaryCell_Vat = new Cell
                {
                    DataType = CellValues.Number,
                    CellValue = new CellValue(Convert.ToString(item.Vat.Value)),
                    CellReference = $"F{currentRowIndex}",
                    StyleIndex = 0,
                };

                Cell summaryCell_Total = new Cell
                {
                    DataType = CellValues.Number,
                    CellValue = new CellValue(Convert.ToString(item.Total.Value)),
                    CellReference = $"G{currentRowIndex}",
                    StyleIndex = 0,
                };

                summaryRow.Append(summaryCell_VatCode, summaryCell_VatDescription, summaryCell_VatRate,
                    summaryCell_Amount, summaryCell_Vat, summaryCell_Total);

                sheetData.Append(summaryRow);

                Merge(worksheet, summaryCell_VatDescription.CellReference, $"C{currentRowIndex}");

                currentRowIndex += 1;
            }

            Row summaryTotalRow = new Row { RowIndex = currentRowIndex };
            Cell summaryTotalCaptionCell = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Totale"),
                CellReference = $"D{currentRowIndex}",
                StyleIndex = 1,
            };

            Cell summaryAmountCell = new Cell
            {
                DataType = CellValues.Number,
                CellValue = new CellValue(Convert.ToString(currentPage.SummaryAmount.Value)),
                CellReference = $"E{currentRowIndex}",
                StyleIndex = 1,
            };

            Cell summaryVatCell = new Cell
            {
                DataType = CellValues.Number,
                CellValue = new CellValue(Convert.ToString(currentPage.SummaryVat.Value)),
                CellReference = $"F{currentRowIndex}",
                StyleIndex = 1,
            };

            Cell summaryTotalCell = new Cell
            {
                DataType = CellValues.Number,
                CellValue = new CellValue(Convert.ToString(currentPage.SummaryTotal.Value)),
                CellReference = $"G{currentRowIndex}",
                StyleIndex = 1,
            };


            summaryTotalRow.Append(summaryTotalCaptionCell, summaryAmountCell, summaryVatCell, summaryTotalCell);
            sheetData.Append(summaryTotalRow);

            return currentRowIndex;
        }

        private UInt32Value CreateFinalSummaryTableHeader(Worksheet worksheet, SheetData sheetData, UInt32Value currentRowIndex)
        {
            Row summaryTableCaptionRow = new Row { RowIndex = currentRowIndex };
            Cell summaryTableCaptionCell = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Riepilogo generale"),
                CellReference = $"A{currentRowIndex}",
                StyleIndex = 1,
            };

            summaryTableCaptionRow.Append(summaryTableCaptionCell);
            sheetData.Append(summaryTableCaptionRow);

            Merge(worksheet, summaryTableCaptionCell.CellReference, $"C{currentRowIndex}");

            currentRowIndex += 1;
            Row summaryHeaderRow = new Row { RowIndex = currentRowIndex };
            Cell summaryHeaderCell_VatCode = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Cod. IVA"),
                CellReference = $"A{currentRowIndex}",
                StyleIndex = 2,
            };

            Cell summaryHeaderCell_VatDescription = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Descrizione IVA"),
                CellReference = $"B{currentRowIndex}",
                StyleIndex = 2,
            };

            Cell summaryHeaderCell_VatRate = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("% IVA"),
                CellReference = $"D{currentRowIndex}",
                StyleIndex = 2,
            };

            Cell summaryHeaderCell_Amount = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Imponibile"),
                CellReference = $"E{currentRowIndex}",
                StyleIndex = 2,
            };

            Cell summaryHeaderCell_Vat = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Imposta"),
                CellReference = $"F{currentRowIndex}",
                StyleIndex = 2,
            };

            Cell summaryHeaderCell_Total = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Totale"),
                CellReference = $"G{currentRowIndex}",
                StyleIndex = 2,
            };

            summaryHeaderRow.Append(summaryHeaderCell_VatCode, summaryHeaderCell_VatDescription, summaryHeaderCell_VatRate,
                summaryHeaderCell_Amount, summaryHeaderCell_Vat, summaryHeaderCell_Total);

            sheetData.Append(summaryHeaderRow);

            Merge(worksheet, summaryHeaderCell_VatDescription.CellReference, $"C{currentRowIndex}");

            return currentRowIndex;
        }

        private UInt32Value CreateFinalSummaryTableRows(Worksheet worksheet, SheetData sheetData, UInt32Value currentRowIndex,
            IEnumerable<SummaryRow> finalSummary, SummaryTotals finalSummaryTotals)
        {
            foreach (var item in finalSummary)
            {
                Row summaryRow = new Row { RowIndex = currentRowIndex };
                Cell summaryCell_VatCode = new Cell
                {
                    DataType = CellValues.String,
                    CellValue = new CellValue(item.VatCode),
                    CellReference = $"A{currentRowIndex}",
                    StyleIndex = 0,
                };

                Cell summaryCell_VatDescription = new Cell
                {
                    DataType = CellValues.String,
                    CellValue = new CellValue(item.VatDescription),
                    CellReference = $"B{currentRowIndex}",
                    StyleIndex = 0,
                };

                Cell summaryCell_VatRate = new Cell
                {
                    DataType = CellValues.Number,
                    CellValue = new CellValue(Convert.ToString(item.RatePercentage.Value)),
                    CellReference = $"D{currentRowIndex}",
                    StyleIndex = 0,
                };

                Cell summaryCell_Amount = new Cell
                {
                    DataType = CellValues.Number,
                    CellValue = new CellValue(Convert.ToString(item.Amount.Value)),
                    CellReference = $"E{currentRowIndex}",
                    StyleIndex = 0,
                };

                Cell summaryCell_Vat = new Cell
                {
                    DataType = CellValues.Number,
                    CellValue = new CellValue(Convert.ToString(item.Vat.Value)),
                    CellReference = $"F{currentRowIndex}",
                    StyleIndex = 0,
                };

                Cell summaryCell_Total = new Cell
                {
                    DataType = CellValues.Number,
                    CellValue = new CellValue(Convert.ToString(item.Total.Value)),
                    CellReference = $"G{currentRowIndex}",
                    StyleIndex = 0,
                };

                summaryRow.Append(summaryCell_VatCode, summaryCell_VatDescription, summaryCell_VatRate,
                    summaryCell_Amount, summaryCell_Vat, summaryCell_Total);

                sheetData.Append(summaryRow);

                Merge(worksheet, summaryCell_VatDescription.CellReference, $"C{currentRowIndex}");

                currentRowIndex += 1;
            }

            Row summaryTotalRow = new Row { RowIndex = currentRowIndex };
            Cell summaryTotalCaptionCell = new Cell
            {
                DataType = CellValues.String,
                CellValue = new CellValue("Totale"),
                CellReference = $"D{currentRowIndex}",
                StyleIndex = 1,
            };

            Cell summaryAmountCell = new Cell
            {
                DataType = CellValues.Number,
                CellValue = new CellValue(Convert.ToString(finalSummaryTotals.Amount.Value)),
                CellReference = $"E{currentRowIndex}",
                StyleIndex = 1,
            };

            Cell summaryVatCell = new Cell
            {
                DataType = CellValues.Number,
                CellValue = new CellValue(Convert.ToString(finalSummaryTotals.Vat.Value)),
                CellReference = $"F{currentRowIndex}",
                StyleIndex = 1,
            };

            Cell summaryTotalCell = new Cell
            {
                DataType = CellValues.Number,
                CellValue = new CellValue(Convert.ToString(finalSummaryTotals.Total.Value)),
                CellReference = $"G{currentRowIndex}",
                StyleIndex = 1,
            };


            summaryTotalRow.Append(summaryTotalCaptionCell, summaryAmountCell, summaryVatCell, summaryTotalCell);
            sheetData.Append(summaryTotalRow);

            return currentRowIndex;
        }

        private void Merge(Worksheet worksheet, string firstCellName, string lastCellName)
        {
            MergeCells mergeCells;
            if (worksheet.Elements<MergeCells>().Count() > 0)
            {
                mergeCells = worksheet.Elements<MergeCells>().First();
            }
            else
            {
                mergeCells = new MergeCells();
                worksheet.InsertAfter(mergeCells, worksheet.Elements<SheetData>().First());
            }

            MergeCell mergeCell = new MergeCell() { Reference = new StringValue(firstCellName + ":" + lastCellName) };
            mergeCells.Append(mergeCell);

            worksheet.Save();
        }

        private Stylesheet CreateStylesheet()
        {
            Stylesheet stylesheet = new Stylesheet();
            stylesheet.AddNamespaceDeclaration("mc", "http://schemas.openxmlformats.org/markup-compatibility/2006");

            Fonts fontsCollection = new Fonts() { Count = (UInt32Value)1U, KnownFonts = true };

            Font defaultFont = new Font();
            FontSize defaultFontSize = new FontSize() { Val = 11D };
            Color defaultFontColor = new Color() { Theme = (UInt32Value)1U };
            FontName defaultFontName = new FontName() { Val = "Calibri" };
            FontFamilyNumbering defaultFontFamilyNumbering = new FontFamilyNumbering() { Val = 2 };
            FontScheme defaultFontScheme = new FontScheme() { Val = FontSchemeValues.Minor };

            defaultFont.Append(defaultFontSize);
            defaultFont.Append(defaultFontColor);
            defaultFont.Append(defaultFontName);
            defaultFont.Append(defaultFontFamilyNumbering);
            defaultFont.Append(defaultFontScheme);

            Font boldFont = new Font();
            FontSize boldFontSize = new FontSize() { Val = 12D };
            Color boldFontColor = new Color() { Theme = (UInt32Value)1U };
            FontName boldFontName = new FontName() { Val = "Calibri" };
            FontFamilyNumbering boldFontFamilyNumbering = new FontFamilyNumbering() { Val = 2 };
            FontScheme boldFontScheme = new FontScheme() { Val = FontSchemeValues.Minor };

            boldFont.Append(new Bold());
            boldFont.Append(boldFontSize);
            boldFont.Append(boldFontColor);
            boldFont.Append(boldFontName);
            boldFont.Append(boldFontFamilyNumbering);
            boldFont.Append(boldFontScheme);

            Font tableHeaderFont = new Font();
            FontSize tableHeaderFontSize = new FontSize() { Val = 11D };
            Color tableHeaderFontColor = new Color() { Rgb = new HexBinaryValue("808080") };
            FontName tableHeaderFontName = new FontName() { Val = "Calibri" };
            FontFamilyNumbering tableHeaderFontFamilyNumbering = new FontFamilyNumbering() { Val = 2 };
            FontScheme tableHeaderFontScheme = new FontScheme() { Val = FontSchemeValues.Minor };

            tableHeaderFont.Append(new Bold());
            tableHeaderFont.Append(tableHeaderFontSize);
            tableHeaderFont.Append(tableHeaderFontColor);
            tableHeaderFont.Append(tableHeaderFontName);
            tableHeaderFont.Append(tableHeaderFontFamilyNumbering);
            tableHeaderFont.Append(tableHeaderFontScheme);

            fontsCollection.Append(defaultFont, boldFont, tableHeaderFont);

            Fills fills0 = new Fills() { Count = (UInt32Value)1U };

            // FillId = 0
            Fill fill0 = new Fill();
            PatternFill patternFill1 = new PatternFill() { PatternType = PatternValues.None };
            fill0.Append(patternFill1);

            fills0.Append(fill0);

            Borders borders0 = new Borders() { Count = (UInt32Value)1U };

            Border border1 = new Border();
            LeftBorder leftBorder1 = new LeftBorder();
            RightBorder rightBorder1 = new RightBorder();
            TopBorder topBorder1 = new TopBorder();
            BottomBorder bottomBorder1 = new BottomBorder();
            DiagonalBorder diagonalBorder1 = new DiagonalBorder();

            border1.Append(leftBorder1);
            border1.Append(rightBorder1);
            border1.Append(topBorder1);
            border1.Append(bottomBorder1);
            border1.Append(diagonalBorder1);

            borders0.Append(border1);

            Alignment tableHeaderAlignment = new Alignment
            {
                Horizontal = HorizontalAlignmentValues.Left,
                Vertical = VerticalAlignmentValues.Center,
                WrapText = false
            };

            CellFormats cellFormatsCollection = new CellFormats() { Count = (UInt32Value)1U };
            CellFormat cellFormatDefault = new CellFormat() { NumberFormatId = (UInt32Value)0U, FontId = (UInt32Value)0U, FillId = (UInt32Value)0U, BorderId = (UInt32Value)0U, FormatId = (UInt32Value)0U };
            CellFormat cellFormatBold = new CellFormat() { NumberFormatId = (UInt32Value)0U, FontId = (UInt32Value)1U, FillId = (UInt32Value)0U, BorderId = (UInt32Value)0U, FormatId = (UInt32Value)0U };
            CellFormat cellFormatTableHeader = new CellFormat {Alignment = tableHeaderAlignment, FontId = (UInt32Value)2U, FillId = (UInt32Value)0U, BorderId = (UInt32Value)0U, FormatId = (UInt32Value)0U };

            cellFormatsCollection.Append(cellFormatDefault, cellFormatBold, cellFormatTableHeader);

            stylesheet.Append(fontsCollection);
            stylesheet.Append(fills0);
            stylesheet.Append(borders0);
            stylesheet.Append(cellFormatsCollection);

            return stylesheet;
        }
    }
}