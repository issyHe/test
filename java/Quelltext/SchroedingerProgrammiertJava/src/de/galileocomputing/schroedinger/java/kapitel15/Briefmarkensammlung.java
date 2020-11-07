package de.galileocomputing.schroedinger.java.kapitel15;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * 
 * @author Philip Ackermann
 * 
 */
public class Briefmarkensammlung {
	private final static String ERSTELLE_TABELLE_ANWEISUNG = "CREATE TABLE BRIEFMARKENSAMMLUNG"
			+ "( "
			+ "ID INT NOT NULL GENERATED BY DEFAULT AS IDENTITY, "
			+ "LAND VARCHAR(32), "
			+ "WAEHRUNG VARCHAR(14), "
			+ "WERT INT, "
			+ "SAMMLERWERT INT, " 
			+ "PRIMARY KEY (ID) " 
			+ ")";
	
	public static void main(String[] args) throws ClassNotFoundException, SQLException {
		Connection verbindung = erstelleVerbindung();
		erstelleTabelle(verbindung);
	}
	
	private static Connection erstelleVerbindung()
			throws ClassNotFoundException, SQLException {
		Class.forName("org.apache.derby.jdbc.EmbeddedDriver");
		Connection verbindung = DriverManager.getConnection("jdbc:derby:d:/Dev/datenbanken/briefmarken;create=true");
		return verbindung;
	}
	
	private static void erstelleTabelle(Connection verbindung)
			throws SQLException {
		DatabaseMetaData metaDaten = verbindung.getMetaData();
		ResultSet tabellen = metaDaten.getTables(null, "APP", "BRIEFMARKENSAMMLUNG", null);
		if (!tabellen.next()) {
			Statement anweisung = verbindung.createStatement();
			anweisung.executeUpdate(ERSTELLE_TABELLE_ANWEISUNG);
			anweisung.close();
		}
	}
}
